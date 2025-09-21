from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import uuid4
from app.constants.enums.chat_enums import SenderEnum

class ChatThread(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(index=True)
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None  #TODO: Only update when thread is actually modified


class ChatMessage(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    thread_id: str = Field(foreign_key="chatthread.id")
    content: str
    sender: SenderEnum = SenderEnum.user
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChatSummary(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    thread_id: str = Field(foreign_key="chatthread.id")
    content: str
    last_message_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
