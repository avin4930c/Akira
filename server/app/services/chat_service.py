from fastapi import Depends
from datetime import datetime
from typing import List, Optional
from sqlmodel import Session, select
from app.model.sql_models.chat import ChatThread, ChatMessage, ChatSummary
from app.core.database import get_session


class ChatService:
    def __init__(self, session: Session):
        self.session = session

    async def create_chat_thread(self, user_id: str, title: str) -> ChatThread:
        thread = ChatThread(
            user_id=user_id,
            title=title,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        self.session.add(thread)
        self.session.commit()
        self.session.refresh(thread)

        return thread

    async def get_chat_thread(self, thread_id: str, user_id: str) -> Optional[ChatThread]:
        statement = select(ChatThread).where(
            ChatThread.id == thread_id,
            ChatThread.user_id == user_id
        )
        return self.session.exec(statement).first()

    async def list_chat_threads(self, user_id: str) -> List[ChatThread]:
        statement = select(ChatThread).where(
            ChatThread.user_id == user_id
        ).order_by(ChatThread.updated_at.desc())
        return list(self.session.exec(statement).all())

    async def update_chat_thread(self, thread_id: str, user_id: str, new_title: Optional[str] = None) -> Optional[ChatThread]:
        thread = await self.get_chat_thread(thread_id, user_id)
        if not thread:
            return None

        if new_title and new_title.strip():
            thread.title = new_title

        thread.updated_at = datetime.utcnow()

        self.session.add(thread)
        self.session.commit()
        self.session.refresh(thread)
        return thread

    async def delete_chat_thread(self, thread_id: str, user_id: str) -> bool:
        # TODO: First verify ownership
        thread = await self.get_chat_thread(thread_id, user_id)
        if not thread:
            return False

        message_statement = select(ChatMessage).where(
            ChatMessage.thread_id == thread_id)
        messages = self.session.exec(message_statement).all()
        for message in messages:
            self.session.delete(message)

        summary_statement = select(ChatSummary).where(
            ChatSummary.thread_id == thread_id)
        summaries = self.session.exec(summary_statement).all()
        for summary in summaries:
            self.session.delete(summary)

        self.session.delete(thread)
        self.session.commit()
        return True

    async def get_chat_messages(self, thread_id: str, limit: Optional[int] = None) -> List[ChatMessage]:
        statement = select(ChatMessage).where(
            ChatMessage.thread_id == thread_id
        ).order_by(ChatMessage.created_at.asc())

        if limit:
            statement = statement.limit(limit)

        return list(self.session.exec(statement).all())

    async def save_message(self, thread_id: str, content: str, sender: str) -> ChatMessage:
        message = ChatMessage(
            thread_id=thread_id,
            content=content,
            sender=sender,
            created_at=datetime.utcnow()
        )

        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        
        return message

    async def get_thread_summary(self, thread_id: str) -> Optional[ChatSummary]:
        statement = select(ChatSummary).where(
            ChatSummary.thread_id == thread_id
        ).order_by(ChatSummary.created_at.desc()).limit(1)
        return self.session.exec(statement).first()

    async def save_summary(self, thread_id: str, summary_content: str, last_message_id: str) -> ChatSummary:
        existing_summary = await self.get_thread_summary(thread_id)

        if existing_summary:
            existing_summary.content = summary_content
            existing_summary.last_message_id = last_message_id
            existing_summary.updated_at = datetime.utcnow()
            self.session.add(existing_summary)
            summary = existing_summary
        else:
            summary = ChatSummary(
                thread_id=thread_id,
                content=summary_content,
                last_message_id=last_message_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            self.session.add(summary)

        self.session.commit()
        self.session.refresh(summary)
        return summary


def get_chat_service(db: Session = Depends(get_session)) -> ChatService:
    return ChatService(session=db)
