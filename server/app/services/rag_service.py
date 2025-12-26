import io
import re
import time
from typing import List, Optional
from dataclasses import dataclass
from enum import Enum

import tiktoken
from fastapi import Depends
from pypdf import PdfReader
from sqlalchemy import delete
from sqlmodel import Session, select

from app.core.database import get_session
from app.model.sql_models.rag import RagChunk
from app.clients.embedding_clients.base_embedding_client import BaseEmbeddingClient
from app.clients.embedding_clients.gemini_embedding_client import get_gemini_embedding_client
from app.config.logger_config import setup_logger
from app.utils.db_utils import escape_like_pattern
from app.constants.rag import (
    DEFAULT_CHUNK_SIZE,
    DEFAULT_CHUNK_OVERLAP,
    DEFAULT_TOKEN_ENCODING,
    EMBEDDING_BATCH_SIZE,
    EMBEDDING_MAX_RETRIES,
    EMBEDDING_BATCH_DELAY,
)

log = setup_logger(__name__)


class ChunkingStrategy(Enum):
    TOKEN = "token"
    RECURSIVE = "recursive"
    SENTENCE = "sentence"


@dataclass
class RetrievedChunk:
    id: int
    source: str
    vehicle_model: Optional[str]
    section: Optional[str]
    content: str
    score: float
    chunk_index: int = 0


@dataclass
class ChunkMetadata:
    chunk_index: int
    token_count: int
    start_char: int
    end_char: int


class TextChunker:    
    SENTENCE_ENDINGS = re.compile(r'(?<=[.!?])\s+(?=[A-Z])')
    PARAGRAPH_BREAKS = re.compile(r'\n\s*\n')
    
    def __init__(
        self,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
        encoding_name: str = DEFAULT_TOKEN_ENCODING,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.get_encoding(encoding_name)
    
    def count_tokens(self, text: str) -> int:
        return len(self.encoding.encode(text))
    
    def _split_into_sentences(self, text: str) -> List[str]:
        paragraphs = self.PARAGRAPH_BREAKS.split(text)
        sentences = []
        for para in paragraphs:
            if not para.strip():
                continue
            para_sentences = self.SENTENCE_ENDINGS.split(para)
            sentences.extend([s.strip() for s in para_sentences if s.strip()])
        return sentences
    
    def chunk_by_tokens(self, text: str) -> List[tuple[str, ChunkMetadata]]:
        if not text or not text.strip():
            return []
        
        sentences = self._split_into_sentences(text)
        chunks: List[tuple[str, ChunkMetadata]] = []
        
        current_chunk: List[str] = []
        current_tokens = 0
        chunk_start_char = 0
        current_char_pos = 0
        
        for sentence in sentences:
            sentence_tokens = self.count_tokens(sentence)
            
            if sentence_tokens > self.chunk_size:
                if current_chunk:
                    chunk_text = " ".join(current_chunk)
                    chunks.append((
                        chunk_text,
                        ChunkMetadata(
                            chunk_index=len(chunks),
                            token_count=current_tokens,
                            start_char=chunk_start_char,
                            end_char=current_char_pos,
                        )
                    ))
                    current_chunk = []
                    current_tokens = 0
                    chunk_start_char = current_char_pos
                
                words = sentence.split()
                sub_chunk: List[str] = []
                sub_tokens = 0
                
                for word in words:
                    word_tokens = self.count_tokens(word + " ")
                    if sub_tokens + word_tokens > self.chunk_size and sub_chunk:
                        chunk_text = " ".join(sub_chunk)
                        chunks.append((
                            chunk_text,
                            ChunkMetadata(
                                chunk_index=len(chunks),
                                token_count=sub_tokens,
                                start_char=chunk_start_char,
                                end_char=current_char_pos,
                            )
                        ))
                        overlap_words = sub_chunk[-max(1, len(sub_chunk) // 4):]
                        sub_chunk = overlap_words + [word]
                        sub_tokens = self.count_tokens(" ".join(sub_chunk))
                        chunk_start_char = current_char_pos
                    else:
                        sub_chunk.append(word)
                        sub_tokens += word_tokens
                
                if sub_chunk:
                    current_chunk = sub_chunk
                    current_tokens = sub_tokens
                    
            elif current_tokens + sentence_tokens > self.chunk_size and current_chunk:
                chunk_text = " ".join(current_chunk)
                chunks.append((
                    chunk_text,
                    ChunkMetadata(
                        chunk_index=len(chunks),
                        token_count=current_tokens,
                        start_char=chunk_start_char,
                        end_char=current_char_pos,
                    )
                ))
                
                overlap_sentences = []
                overlap_tokens = 0
                for s in reversed(current_chunk):
                    s_tokens = self.count_tokens(s)
                    if overlap_tokens + s_tokens <= self.chunk_overlap:
                        overlap_sentences.insert(0, s)
                        overlap_tokens += s_tokens
                    else:
                        break
                
                current_chunk = overlap_sentences + [sentence]
                current_tokens = overlap_tokens + sentence_tokens
                chunk_start_char = current_char_pos
            else:
                current_chunk.append(sentence)
                current_tokens += sentence_tokens
            
            current_char_pos += len(sentence) + 1
        
        if current_chunk:
            chunk_text = " ".join(current_chunk)
            chunks.append((
                chunk_text,
                ChunkMetadata(
                    chunk_index=len(chunks),
                    token_count=current_tokens,
                    start_char=chunk_start_char,
                    end_char=current_char_pos,
                )
            ))
        
        return chunks
    
    def chunk_recursive(
        self, 
        text: str,
        separators: Optional[List[str]] = None,
    ) -> List[tuple[str, ChunkMetadata]]:
        if separators is None:
            separators = ["\n\n", "\n", ". ", " ", ""]
        
        if not text or not text.strip():
            return []
        
        chunks: List[tuple[str, ChunkMetadata]] = []
        self._recursive_split(text, separators, 0, chunks, 0)
        return chunks
    
    def _recursive_split(
        self,
        text: str,
        separators: List[str],
        sep_index: int,
        chunks: List[tuple[str, ChunkMetadata]],
        char_offset: int,
    ) -> None:
        if not text.strip():
            return
        
        token_count = self.count_tokens(text)
        if token_count <= self.chunk_size:
            chunks.append((
                text.strip(),
                ChunkMetadata(
                    chunk_index=len(chunks),
                    token_count=token_count,
                    start_char=char_offset,
                    end_char=char_offset + len(text),
                )
            ))
            return
        
        if sep_index >= len(separators):
            char_limit = (self.chunk_size * 4)
            for i in range(0, len(text), char_limit - 50):
                chunk = text[i:i + char_limit].strip()
                if chunk:
                    chunks.append((
                        chunk,
                        ChunkMetadata(
                            chunk_index=len(chunks),
                            token_count=self.count_tokens(chunk),
                            start_char=char_offset + i,
                            end_char=char_offset + i + len(chunk),
                        )
                    ))
            return
        
        separator = separators[sep_index]
        if separator:
            parts = text.split(separator)
        else:
            parts = list(text)
        
        current_part = ""
        current_offset = char_offset
        
        for part in parts:
            test_text = current_part + separator + part if current_part else part
            if self.count_tokens(test_text) <= self.chunk_size:
                current_part = test_text
            else:
                if current_part:
                    self._recursive_split(
                        current_part, separators, sep_index + 1, 
                        chunks, current_offset
                    )
                current_offset += len(current_part) + len(separator)
                current_part = part
        
        if current_part:
            self._recursive_split(
                current_part, separators, sep_index + 1,
                chunks, current_offset
            )


class RAGService:
    def __init__(
        self,
        session: Session,
        embedding_provider: BaseEmbeddingClient,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
        chunking_strategy: ChunkingStrategy = ChunkingStrategy.TOKEN,
    ):
        self.session = session
        self.embedding_client = embedding_provider.get_embedding_client()
        self.chunker = TextChunker(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        self.chunking_strategy = chunking_strategy
        
        log.info(f"RAGService initialized with {chunking_strategy.value} chunking")
    
    def _chunk_text(self, text: str) -> List[tuple[str, ChunkMetadata]]:
        """Split text into chunks based on the configured chunking strategy."""
        if self.chunking_strategy == ChunkingStrategy.TOKEN:
            return self.chunker.chunk_by_tokens(text)
        elif self.chunking_strategy == ChunkingStrategy.RECURSIVE:
            return self.chunker.chunk_recursive(text)
        else:
            return self.chunker.chunk_by_tokens(text)
    
    def _extract_pdf_text(self, pdf_bytes: bytes) -> str:
        """Extract text content from PDF bytes, removing NUL characters."""
        reader = PdfReader(io.BytesIO(pdf_bytes))
        pages_text = []
        
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            page_text = page_text.replace("\x00", "")
            if page_text.strip():
                pages_text.append(f"[Page {page_num + 1}]\n{page_text}")
        
        return "\n\n".join(pages_text)
    
    def _embed_batch(self, texts: List[str], batch_size: int = EMBEDDING_BATCH_SIZE) -> List[List[float]]:
        all_embeddings = []
        total_batches = (len(texts) - 1) // batch_size + 1
        
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            current_batch_num = i // batch_size + 1
            
            # Simple retry logic for rate limits
            for attempt in range(EMBEDDING_MAX_RETRIES):
                try:
                    embeddings = self.embedding_client.embed_documents(batch)
                    all_embeddings.extend(embeddings)
                    break
                except Exception as e:
                    if "429" in str(e) or "quota" in str(e).lower():
                        if attempt < EMBEDDING_MAX_RETRIES - 1:
                            wait_time = (attempt + 1) * 2
                            log.warning(f"Rate limit hit. Retrying batch {current_batch_num}/{total_batches} in {wait_time}s...")
                            time.sleep(wait_time)
                            continue
                    log.error(f"Failed to embed batch {current_batch_num}: {e}")
                    raise e
            
            if i + batch_size < len(texts):
                time.sleep(EMBEDDING_BATCH_DELAY)
                
        return all_embeddings
    
    def ingest_pdf(
        self,
        pdf_bytes: bytes,
        source: str,
        vehicle_model: Optional[str] = None,
        section: Optional[str] = None,
    ) -> dict:
        full_text = self._extract_pdf_text(pdf_bytes)
        
        if not full_text.strip():
            raise ValueError("PDF contains no extractable text")
        
        chunks_with_metadata = self._chunk_text(full_text)
        
        if not chunks_with_metadata:
            raise ValueError("No chunks generated from PDF")
        
        chunk_texts = [chunk for chunk, _ in chunks_with_metadata]
        vectors = self._embed_batch(chunk_texts)
        
        try:
            for (content, metadata), vec in zip(chunks_with_metadata, vectors):
                chunk_record = RagChunk(
                    source=source,
                    vehicle_model=vehicle_model,
                    section=section,
                    chunk_index=metadata.chunk_index,
                    content=content,
                    embedding=vec
                )
                self.session.add(chunk_record)
            
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            log.error(f"Failed to commit chunks to database: {e}")
            raise ValueError(f"Database commit failed: {str(e)}")
        
        log.info(f"Ingested {len(chunks_with_metadata)} chunks from {source}")
        
        return {
            "status": "success",
            "source": source,
            "chunks_processed": len(chunks_with_metadata),
            "total_tokens": sum(m.token_count for _, m in chunks_with_metadata),
        }
    
    def ingest_text(
        self,
        text_content: str,
        source: str,
        vehicle_model: Optional[str] = None,
        section: Optional[str] = None,
    ) -> dict:
        if not text_content or not text_content.strip():
            raise ValueError("Text content is empty")
        
        chunks_with_metadata = self._chunk_text(text_content)
        
        if not chunks_with_metadata:
            raise ValueError("No chunks generated from text")
        
        chunk_texts = [chunk for chunk, _ in chunks_with_metadata]
        vectors = self._embed_batch(chunk_texts)
        
        try:
            for (content, metadata), vec in zip(chunks_with_metadata, vectors):
                chunk_record = RagChunk(
                    source=source,
                    vehicle_model=vehicle_model,
                    section=section,
                    chunk_index=metadata.chunk_index,
                    content=content,
                    embedding=vec
                )
                self.session.add(chunk_record)
            
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            log.error(f"Failed to commit text chunks to database: {e}")
            raise ValueError(f"Database commit failed: {str(e)}")
        
        log.info(f"Ingested {len(chunks_with_metadata)} chunks from {source}")
        
        return {
            "status": "success",
            "source": source,
            "chunks_processed": len(chunks_with_metadata),
            "total_tokens": sum(m.token_count for _, m in chunks_with_metadata),
        }
    
    def retrieve(
        self,
        query: str,
        vehicle_model: Optional[str] = None,
        section: Optional[str] = None,
        top_k: int = 5,
        score_threshold: Optional[float] = None,
    ) -> List[RetrievedChunk]:
        query_vector = self.embedding_client.embed_query(query)
        
        distance_expr = RagChunk.embedding.cosine_distance(query_vector)
        score_expr = 1 - distance_expr
        
        statement = select(RagChunk, score_expr.label("score"))
        
        if vehicle_model:
            escaped_model = escape_like_pattern(vehicle_model)
            statement = statement.where(RagChunk.vehicle_model.ilike(f"%{escaped_model}%"))
        
        if section:
            escaped_section = escape_like_pattern(section)
            statement = statement.where(RagChunk.section.ilike(f"%{escaped_section}%"))
        
        if score_threshold is not None:
            statement = statement.where(score_expr >= score_threshold)
            
        statement = statement.order_by(distance_expr).limit(top_k)
        
        results = self.session.exec(statement).all()
        
        return [
            RetrievedChunk(
                id=chunk.id,
                source=chunk.source,
                vehicle_model=chunk.vehicle_model,
                section=chunk.section,
                content=chunk.content,
                score=score,
                chunk_index=chunk.chunk_index,
            )
            for chunk, score in results
        ]
    
    def retrieve_with_context(
        self,
        query: str,
        vehicle_model: Optional[str] = None,
        section: Optional[str] = None,
        top_k: int = 5,
        context_window: int = 1,
        score_threshold: Optional[float] = None,
    ) -> List[RetrievedChunk]:
        main_chunks = self.retrieve(
            query=query,
            vehicle_model=vehicle_model,
            section=section,
            top_k=top_k,
            score_threshold=score_threshold,
        )
        
        if not main_chunks or context_window == 0:
            return main_chunks
        
        all_chunks = {}
        for chunk in main_chunks:
            all_chunks[(chunk.source, chunk.chunk_index)] = chunk
            
            statement = (
                select(RagChunk)
                .where(RagChunk.source == chunk.source)
                .where(RagChunk.chunk_index >= max(0, chunk.chunk_index - context_window))
                .where(RagChunk.chunk_index <= chunk.chunk_index + context_window)
                .order_by(RagChunk.chunk_index)
            )
            
            context_rows = self.session.exec(statement).all()
            
            for r in context_rows:
                key = (r.source, r.chunk_index)
                if key not in all_chunks:
                    all_chunks[key] = RetrievedChunk(
                        id=r.id,
                        source=r.source,
                        vehicle_model=r.vehicle_model,
                        section=r.section,
                        content=r.content,
                        score=0.0,
                        chunk_index=r.chunk_index,
                    )
        
        sorted_chunks = sorted(
            all_chunks.values(),
            key=lambda c: (c.source, c.chunk_index)
        )
        
        return sorted_chunks
    
    def delete_by_source(self, source: str) -> int:
        count_stmt = select(RagChunk).where(RagChunk.source == source)
        count = len(self.session.exec(count_stmt).all())
        
        delete_stmt = delete(RagChunk).where(RagChunk.source == source)
        self.session.execute(delete_stmt)
        self.session.commit()
        
        log.info(f"Deleted {count} chunks from source: {source}")
        return count
    
    def list_sources(
        self,
        vehicle_model: Optional[str] = None,
        section: Optional[str] = None,
    ) -> List[dict]:
        """List ingested sources with optional filtering by vehicle_model or section."""
        statement = (
            select(
                RagChunk.source,
                RagChunk.vehicle_model,
                RagChunk.section,
            )
            .distinct()
        )
        
        if vehicle_model:
            escaped_model = escape_like_pattern(vehicle_model)
            statement = statement.where(RagChunk.vehicle_model.ilike(f"%{escaped_model}%"))
        
        if section:
            escaped_section = escape_like_pattern(section)
            statement = statement.where(RagChunk.section.ilike(f"%{escaped_section}%"))
        
        statement = statement.order_by(RagChunk.source)
        
        rows = self.session.exec(statement).all()
        
        return [
            {
                "source": r.source,
                "vehicle_model": r.vehicle_model,
                "section": r.section,
            }
            for r in rows
        ]

def get_rag_service(
    session: Session = Depends(get_session),
    embedding_provider: BaseEmbeddingClient = Depends(get_gemini_embedding_client),
) -> RAGService:
    return RAGService(
        session=session,
        embedding_provider=embedding_provider,
        chunk_size=DEFAULT_CHUNK_SIZE,
        chunk_overlap=DEFAULT_CHUNK_OVERLAP,
        chunking_strategy=ChunkingStrategy.TOKEN,
    )