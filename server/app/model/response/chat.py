from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateThreadResponse(BaseModel):
    thread_id: str = Field(..., alias="id")
    title: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]


class ThreadListResponse(BaseModel):
    thread_id: str = Field(..., alias="id")
    title: str
    created_at: datetime
    updated_at: Optional[datetime]


class GetThreadResponse(BaseModel):
    thread_id: str = Field(..., alias="id")
    title: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]


class MessageResponse(BaseModel):
    message_id: str = Field(..., alias="id")
    thread_id: str
    content: str
    sender: str
    created_at: datetime
    message_order: Optional[int] = None
