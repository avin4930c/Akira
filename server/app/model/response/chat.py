from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BaseChatResponse(BaseModel):
    class Config:
        populate_by_name = True
        allow_population_by_field_name = True


class CreateThreadResponse(BaseChatResponse):
    id: str
    title: str
    user_id: str = Field(alias="userId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: Optional[datetime] = Field(default=None, alias="updatedAt")


class GetThreadResponse(BaseChatResponse):
    id: str
    title: str
    user_id: str = Field(alias="userId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: Optional[datetime] = Field(default=None, alias="updatedAt")


class MessageResponse(BaseChatResponse):
    id: str
    thread_id: str = Field(alias="threadId")
    content: str
    sender: str
    created_at: datetime = Field(alias="createdAt")


class ChatSummaryResponse(BaseChatResponse):
    id: str
    thread_id: str = Field(alias="threadId")
    content: str
    last_message_id: str = Field(alias="lastMessageId")
    created_at: datetime = Field(alias="createdAt")
    updated_at: Optional[datetime] = Field(default=None, alias="updatedAt")
