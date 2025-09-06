import json
import traceback
from uuid import uuid4
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import WebSocket, APIRouter, Depends
from langgraph.graph.state import CompiledStateGraph
from app.services.chat_service import get_chat_service, ChatService
from app.core.websocket_connection_manager import webSocketConnectionManager
from app.config.logger_config import setup_logger
from app.workflows.chat_workflow import get_chat_workflow, ChatWorkflowState

chat_router = APIRouter()
log = setup_logger(__name__)


class ChatRequest(BaseModel):
    message: str
    thread_id: str
    metadata: Optional[dict] = None


@chat_router.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    chat_service: ChatService = Depends(get_chat_service),
    workflow: CompiledStateGraph = Depends(get_chat_workflow),
):
    userId = None

    try:
        userId = await webSocketConnectionManager.connect(websocket=websocket)
        log.info(f"WebSocket connection established for user {userId}")

        while True:
            data = await websocket.receive_text()

            try:
                request_data = json.loads(data)
                chat_request = ChatRequest(**request_data)
                log.info(f"Received chat request: {chat_request}")

                await chat_service.save_message(
                    thread_id=chat_request.thread_id,
                    content=chat_request.message,
                    sender="user",
                )

                previous_messages = await chat_service.get_chat_messages(
                    chat_request.thread_id
                )
                langchain_messages = chat_service.convert_to_langchain_messages(
                    previous_messages
                )

                chat_workflow_input = ChatWorkflowState(
                    messages=langchain_messages,
                    query=chat_request.message,
                    thread_id=chat_request.thread_id,
                )

                existing_message = ""
                partial = True
                message_id = str(uuid4())

                async for ai_response, meta_data in workflow.astream(
                    chat_workflow_input,
                    config={"configurable": {"thread_id": chat_request.thread_id}},
                    stream_mode="messages",
                ):
                    if hasattr(ai_response, "content") and ai_response.content:
                        new_content = ai_response.content
                        existing_message += new_content

                        is_final_chunk = False
                        if (
                            hasattr(ai_response, "response_metadata")
                            and ai_response.response_metadata
                        ):
                            finish_reason = str(
                                ai_response.response_metadata.get("finish_reason")
                            )
                            if finish_reason.lower() in ["stop", "end_turn", "length"]:
                                is_final_chunk = True

                        partial = not is_final_chunk

                        response_message = {
                            "type": "ai_response_stream",
                            "data": {
                                "id": message_id,
                                "content": new_content,
                                "thread_id": chat_request.thread_id,
                                "partial": partial,
                                "timestamp": datetime.now().isoformat(),
                                **meta_data,
                            },
                        }

                        await webSocketConnectionManager.send_message(
                            user_id=userId, message=json.dumps(response_message)
                        )

                # After streaming completes, save the complete message
                if existing_message:
                    await chat_service.save_message(
                        thread_id=chat_request.thread_id,
                        content=existing_message,
                        sender="assistant",
                    )
            except Exception as e:
                log.error(f"Error processing chat request: {e}")
                traceback.print_exc()
                error_message = {
                    "type": "error",
                    "content": {"message": "Error processing chat request"},
                }
                await webSocketConnectionManager.send_message(
                    userId, json.dumps(error_message)
                )

    except Exception as e:
        log.error(f"WebSocket error for user {userId}: {e}")
    finally:
        if userId:
            await webSocketConnectionManager.disconnect(userId)
        log.info(f"WebSocket connection closed for user {userId}")


@chat_router.get("/threads")
async def list_chat_threads(chat_service: ChatService = Depends(get_chat_service)):
    threads = await chat_service.list_chat_threads()
    return threads


@chat_router.get("/threads/{thread_id}")
async def get_chat_thread(
    thread_id: str, chat_service: ChatService = Depends(get_chat_service)
):
    thread = await chat_service.get_chat_thread(thread_id)
    return thread


@chat_router.post("/threads")
async def create_chat_thread(
    user_query: str, chat_service: ChatService = Depends(get_chat_service)
):
    new_thread = await chat_service.create_chat_thread(user_query)
    return new_thread


@chat_router.get("/threads/{thread_id}/messages")
async def get_chat_messages(
    thread_id: str, chat_service: ChatService = Depends(get_chat_service)
):
    messages = await chat_service.get_chat_messages(thread_id)
    return messages
