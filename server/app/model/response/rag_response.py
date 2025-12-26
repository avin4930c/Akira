from typing import Optional
from pydantic import BaseModel

class SearchResult(BaseModel):
    id: int
    source: str
    vehicle_model: Optional[str]
    section: Optional[str]
    content: str
    score: float
    chunk_index: int


class IngestResponse(BaseModel):
    status: str
    source: str
    chunks_processed: int
    total_tokens: int