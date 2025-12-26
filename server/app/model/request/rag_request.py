from typing import Optional
from pydantic import BaseModel

class TextIngestRequest(BaseModel):
    text: str
    source: str
    vehicle_model: Optional[str] = None
    section: Optional[str] = None


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    vehicle_model: Optional[str] = None
    section: Optional[str] = None
    score_threshold: Optional[float] = None
    include_context: bool = False
    context_window: int = 1