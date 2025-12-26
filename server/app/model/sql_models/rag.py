from sqlmodel import SQLModel, Field
from typing import Optional
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column


class RagChunk(SQLModel, table=True):
    """
    Stores document chunks with vector embeddings for RAG retrieval.
    Uses pgvector for similarity search.
    """
    __tablename__ = "rag_chunks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    source: str = Field(index=True)
    vehicle_model: Optional[str] = Field(default=None, index=True)
    section: Optional[str] = Field(default=None, index=True)
    chunk_index: int = Field(default=0)
    content: str
    embedding: list[float] = Field(sa_column=Column(Vector(3072)))
