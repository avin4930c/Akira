from pydantic import BaseModel, Field
from typing import Optional


class CreateThreadRequest(BaseModel):
    user_id: str
    title: Optional[str] = None
    initial_message: Optional[str] = None


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)
    thread_id: Optional[str] = None
    user_id: str
    metadata: Optional[dict] = None


class UpdateThreadRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=500)


class CreateMessageRequest(BaseModel):
    content: str = Field(..., min_length=1)
    sender: str
    thread_id: str


class GetMessagesRequest(BaseModel):
    thread_id: str
    limit: Optional[int] = Field(50, ge=1, le=100)
    offset: Optional[int] = Field(0, ge=0)
