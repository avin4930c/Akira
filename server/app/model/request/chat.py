import json
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class CreateThreadRequest(BaseModel):

    title: Optional[str] = Field(None, max_length=120)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Title cannot be empty or whitespace only")
        return cleaned


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)
    thread_id: str
    metadata: Optional[Dict[str, Any]] = None

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Message content cannot be empty")
        return cleaned

    @field_validator("metadata")
    @classmethod
    def metadata_is_object(cls, value: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if value is None:
            return None
        if not isinstance(value, dict):
            raise ValueError("Metadata must be an object")
        serialized = json.dumps(value)
        if len(serialized) > 4096:
            raise ValueError("Metadata payload exceeds 4KB limit")
        return value


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
