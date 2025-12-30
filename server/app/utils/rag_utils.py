from typing import List
from app.services.rag_service import RetrievedChunk


def format_rag_context(chunks: List[RetrievedChunk]) -> str:
    """
    Format retrieved RAG chunks into a single context string for LLM prompts.
    
    Args:
        chunks: List of RetrievedChunk objects from RAG service
        
    Returns:
        Formatted string with source and section metadata
    """
    if not chunks:
        return "No relevant documentation found."
        
    return "\n\n---\n\n".join([
        f"[Source: {chunk.source}, Section: {chunk.section}]\n{chunk.content}"
        for chunk in chunks
    ])
