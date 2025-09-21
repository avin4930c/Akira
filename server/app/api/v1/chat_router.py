import json
import traceback
from uuid import uuid4
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import WebSocket, APIRouter, Depends, Request
from langgraph.graph.state import CompiledStateGraph
from app.services.chat_service import get_chat_service, ChatService
from app.core.websocket_connection_manager import webSocketConnectionManager
from app.config.logger_config import setup_logger
from app.workflows.chat_workflow import get_chat_workflow, ChatWorkflowState
from app.utils.chat_utils import convert_to_langchain_messages
from app.constants.chat import WORKFLOW_CHAT_MESSAGES_LIMIT

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
                    chat_request.thread_id,
                    limit=WORKFLOW_CHAT_MESSAGES_LIMIT
                )
                previous_messages = list(reversed(previous_messages))
                
                langchain_messages = convert_to_langchain_messages(
                    previous_messages
                )
                
                db_summary = await chat_service.get_thread_summary(chat_request.thread_id)

                chat_workflow_input = ChatWorkflowState(
                    messages=langchain_messages,
                    query=chat_request.message,
                    thread_id=chat_request.thread_id,
                    summary=db_summary.content if db_summary else None,
                    summary_updated=False,
                    last_summary_message_id=db_summary.last_message_id if db_summary else None,
                    db_message_count=len(langchain_messages)
                )

                existing_message = ""
                partial = True
                message_id = str(uuid4())

                async for ai_response, meta_data in workflow.astream(
                    chat_workflow_input,
                    config={"configurable": {
                        "thread_id": chat_request.thread_id}},
                    stream_mode="messages",
                ):
                    if (hasattr(ai_response, "content") and ai_response.content and 
                        meta_data.get("langgraph_node") == "assistant"):
                        new_content = ai_response.content
                        existing_message += new_content

                        is_final_chunk = False
                        if (
                            hasattr(ai_response, "response_metadata")
                            and ai_response.response_metadata
                        ):
                            finish_reason = str(
                                ai_response.response_metadata.get(
                                    "finish_reason")
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
                            user_id=userId, message=json.dumps(
                                response_message)
                        )

                # After streaming completes, save the complete message
                if existing_message:
                    last_saved_message = await chat_service.save_message(
                        thread_id=chat_request.thread_id,
                        content=existing_message,
                        sender="assistant",
                    )
                
                # Save summary when updated
                final_state = workflow.get_state(config={"configurable": {"thread_id": chat_request.thread_id}})
                if (final_state and 
                    final_state.values.get("summary_updated") and
                    final_state.values.get("summary")):

                    if last_saved_message:
                        await chat_service.save_summary(
                            thread_id=chat_request.thread_id,
                            summary_content=final_state.values["summary"],
                            last_message_id=last_saved_message.id
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
    request: Request, thread_id: str, chat_service: ChatService = Depends(get_chat_service)
):
    thread = await chat_service.get_chat_thread(thread_id, user_id=request.state.user_id)
    return thread


@chat_router.post("/threads")
async def create_chat_thread(request: Request, chat_service: ChatService = Depends(get_chat_service)):
    new_thread = await chat_service.create_chat_thread(user_id=request.state.user_id, title="New Chat")
    return new_thread


@chat_router.get("/threads/{thread_id}/messages")
async def get_chat_messages(
    thread_id: str, chat_service: ChatService = Depends(get_chat_service)
):
    messages = await chat_service.get_chat_messages(thread_id)
    return messages
