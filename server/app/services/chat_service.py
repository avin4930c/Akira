from uuid import uuid4
from datetime import datetime
from typing import List, Dict, Any
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


class ChatService:
    def __init__(self):
        pass

    async def create_chat_session(self, user_query: str):
        random_uuid = str(uuid4())
        created_time = datetime.now().isoformat()
        truncated_user_query = (
            (user_query[:20] + "...") if len(user_query) > 20 else user_query
        )
        session = {
            "sessionId": random_uuid,
            "title": truncated_user_query,
            "createdAt": created_time,
        }
        return session

    async def get_chat_session(self, session_id: str):  # TODO: Replace with real data
        mock_session = {
            "sessionId": session_id,
            "title": f"Session {session_id}",
            "createdAt": datetime.now().isoformat(),
        }
        return mock_session

    async def list_chat_sessions(self):  # TODO: Replace with real data
        mock_sessions = [
            {
                "sessionId": str(uuid4()),
                "title": "Session 1",
                "createdAt": datetime.now().isoformat(),
            },
            {
                "sessionId": str(uuid4()),
                "title": "Session 2",
                "createdAt": datetime.now().isoformat(),
            },
        ]
        return mock_sessions

    async def get_chat_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """Get messages for a session in LangChain-compatible format"""
        # TODO: Replace with real database query
        # For now, return mock messages
        mock_messages = [
            {
                "messageId": str(uuid4()),
                "content": "Hello, how can I help you?",
                "sender": "assistant",
                "createdAt": datetime.now().isoformat(),
            }
        ]
        return mock_messages

    def convert_to_langchain_messages(
        self, messages: List[Dict[str, Any]]
    ) -> List[Any]:
        """Convert database messages to LangChain message format"""
        langchain_messages = []

        for msg in messages:
            content = msg.get("content", "")
            sender = msg.get("sender", "user")

            if sender == "user":
                langchain_messages.append(HumanMessage(content=content))
            elif sender == "assistant":
                langchain_messages.append(AIMessage(content=content))
            elif sender == "system":
                langchain_messages.append(SystemMessage(content=content))
            else:
                # Default to human message if sender is unknown
                langchain_messages.append(HumanMessage(content=content))

        return langchain_messages

    async def save_message(self, thread_id: str, content: str, sender: str):
        """Save a message to the database"""
        # TODO: Implement actual database save
        message = {
            "messageId": str(uuid4()),
            "thread_id": thread_id,
            "content": content,
            "sender": sender,
            "createdAt": datetime.now().isoformat(),
        }
        return message


def get_chat_service() -> ChatService:
    chat_service = ChatService()
    return chat_service
