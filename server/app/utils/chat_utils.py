from typing import List, Any
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.model.sql_models.chat import ChatMessage


def convert_to_langchain_messages(
    messages: List[ChatMessage]
) -> List[Any]:
    """Convert database messages to LangChain message format"""
    langchain_messages = []

    for msg in messages:
        msg_id = msg.id
        content = msg.content
        sender = msg.sender.value

        if sender == "user":
            langchain_messages.append(HumanMessage(content=content, id=msg_id))
        elif sender == "assistant":
            langchain_messages.append(AIMessage(content=content, id=msg_id))
        elif sender == "system":
            langchain_messages.append(
                SystemMessage(content=content, id=msg_id))
        else:
            langchain_messages.append(HumanMessage(content=content, id=msg_id))

    return langchain_messages


def convert_chat_history_to_string(message_history: List[Any]) -> str:
    chat_history_str = ""
    for msg in message_history:
        if hasattr(msg, "content"):
            role = (
                "Human" if msg.__class__.__name__ == "HumanMessage" else "Assistant"
            )
            chat_history_str += f"{role}: {msg.content}\n"

    return chat_history_str
