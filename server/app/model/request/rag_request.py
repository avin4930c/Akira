from typing import Optional
from pydantic import BaseModel, Field
from app.constants.rag import MAX_TEXT_LENGTH, MAX_QUERY_LENGTH, MAX_SOURCE_LENGTH


class TextIngestRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT_LENGTH)
    source: str = Field(..., min_length=1, max_length=MAX_SOURCE_LENGTH)
    vehicle_model: Optional[str] = Field(None, max_length=200)
    section: Optional[str] = Field(None, max_length=200)


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=MAX_QUERY_LENGTH)
    top_k: int = Field(5, ge=1, le=50)
    vehicle_model: Optional[str] = Field(None, max_length=200)
    section: Optional[str] = Field(None, max_length=200)
    score_threshold: Optional[float] = Field(None, ge=0.0, le=1.0)
    include_context: bool = False
    context_window: int = Field(1, ge=0, le=5)
