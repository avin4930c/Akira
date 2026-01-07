import json
from uuid import uuid4, UUID
from typing import Optional, List
from datetime import datetime
from pydantic import ValidationError
from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket, status
from langgraph.graph.state import CompiledStateGraph
from app.services.chat_service import get_chat_service, ChatService
from app.core.websocket_connection_manager import webSocketConnectionManager
from app.config.logger_config import setup_logger
from app.workflows.chat_workflow import get_chat_workflow, ChatWorkflowState
from app.utils.chat_utils import convert_to_langchain_messages
from app.constants.chat import WORKFLOW_CHAT_MESSAGES_LIMIT
from app.model.response.chat import (
    CreateThreadResponse,
    GetThreadResponse,
    MessageResponse,
)
from app.model.request.chat import ChatMessageRequest

chat_router = APIRouter()
log = setup_logger(__name__)


def _get_authenticated_user_id(request: Request) -> str:
    user_id = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user context is missing",
        )
    return user_id


def _websocket_error_payload(
    code: str,
    message: str,
    details: Optional[List[dict]] = None,
) -> dict:
    payload = {
        "type": "error",
        "data": {
            "code": code,
            "message": message,
            "timestamp": datetime.now().isoformat(),
        },
    }
    if details:
        payload["data"]["details"] = details
    return payload


@chat_router.websocket("/ws")
async def chat_websocket(
    websocket: WebSocket,
    chat_service: ChatService = Depends(get_chat_service),
    workflow: CompiledStateGraph = Depends(get_chat_workflow),
):
    user_id = None

    try:
        user_id = await webSocketConnectionManager.connect(websocket=websocket)
        log.info(f"WebSocket connection established for user {user_id}")

        while True:
            data = await websocket.receive_text()

            try:
                chat_request: ChatMessageRequest = ChatMessageRequest.model_validate_json(data)
            except ValidationError as exc:
                await webSocketConnectionManager.send_message(
                    user_id,
                    json.dumps(
                        _websocket_error_payload(
                            "validation_error",
                            "Invalid chat request payload",
                            details=exc.errors(),
                        )
                    ),
                )
                continue

            thread_id = chat_request.thread_id

            thread = await chat_service.get_chat_thread(
                thread_id=thread_id,
                user_id=user_id,
            )
            if not thread:
                await webSocketConnectionManager.send_message(
                    user_id,
                    json.dumps(
                        _websocket_error_payload(
                            "thread_not_found",
                            "Thread not found or access denied",
                        )
                    ),
                )
                continue

            current_thread_title = thread.title if thread.title else ""

            await chat_service.save_message(
                thread_id=thread_id,
                content=chat_request.message,
                sender="user",
            )

            previous_messages = await chat_service.get_chat_messages(
                thread_id,
                limit=WORKFLOW_CHAT_MESSAGES_LIMIT,
            )

            langchain_messages = convert_to_langchain_messages(previous_messages)

            db_summary = await chat_service.get_thread_summary(thread_id)

            chat_workflow_input = ChatWorkflowState(
                messages=langchain_messages,
                query=chat_request.message,
                thread_id=thread_id,
                thread_title=current_thread_title,
                thread_updated=False,
                summary=db_summary.content if db_summary else None,
                summary_updated=False,
                last_summary_message_id=db_summary.last_message_id if db_summary else None,
                db_message_count=len(langchain_messages),
            )

            existing_message = ""
            partial = True
            message_id = str(uuid4())
            last_saved_message = None

            async for ai_response, meta_data in workflow.astream(
                chat_workflow_input,
                config={"configurable": {"thread_id": thread_id}},
                stream_mode="messages",
            ):
                if (
                    hasattr(ai_response, "content")
                    and ai_response.content
                    and meta_data.get("langgraph_node") == "assistant"
                ):
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
                            "thread_id": thread_id,
                            "partial": partial,
                            "timestamp": datetime.now().isoformat(),
                            "sender": "assistant",
                            **meta_data,
                        },
                    }

                    await webSocketConnectionManager.send_message(
                        user_id=user_id,
                        message=json.dumps(response_message),
                    )
                    
            last_saved_message_id = None
            if existing_message:
                last_saved_message = await chat_service.save_message(
                    thread_id=thread_id,
                    content=existing_message,
                    sender="assistant",
                )
                last_saved_message_id = last_saved_message.id
                
                await chat_service.update_chat_thread(thread_id=thread_id, user_id=user_id)

            final_state = workflow.get_state(
                config={"configurable": {"thread_id": thread_id}}
            )
            
            summary_updated = final_state.values.get("summary_updated") if final_state else False
            summary_content = final_state.values.get("summary") if final_state else None
            thread_updated = final_state.values.get("thread_updated") if final_state else False
            thread_title = final_state.values.get("thread_title") if final_state else None
            
            if summary_updated and summary_content and last_saved_message_id:
                await chat_service.save_summary(
                    thread_id=thread_id,
                    summary_content=summary_content,
                    last_message_id=last_saved_message_id,
                )
                
            if thread_updated and thread_title:
                await chat_service.update_chat_thread(
                    thread_id=thread_id,
                    user_id=user_id,
                    new_title=thread_title,
                )
                
                thread_update_response_message = {
                    "type": "thread_update",
                    "data": {
                        "thread_id": thread_id,
                        "title": thread_title,
                        "updated": True,
                    }
                }
                
                await webSocketConnectionManager.send_message(
                    user_id=user_id,
                    message=json.dumps(thread_update_response_message),
                )

    except Exception as e:
        log.error(f"WebSocket error for user {user_id}: {e}")
    finally:
        if user_id:
            await webSocketConnectionManager.disconnect(user_id)
        log.info(f"WebSocket connection closed for user {user_id}")


@chat_router.get("/threads", response_model=List[GetThreadResponse])
async def list_chat_threads(
    request: Request, chat_service: ChatService = Depends(get_chat_service)
):
    user_id = _get_authenticated_user_id(request)
    threads = await chat_service.list_chat_threads(user_id=user_id)
    return [GetThreadResponse.model_validate(thread.model_dump()) for thread in threads]


@chat_router.get("/threads/{thread_id}", response_model=GetThreadResponse)
async def get_chat_thread(
    request: Request,
    thread_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    user_id = _get_authenticated_user_id(request)
    thread = await chat_service.get_chat_thread(thread_id, user_id=user_id)
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
    return GetThreadResponse.model_validate(thread.model_dump())


@chat_router.post(
    "/threads",
    response_model=CreateThreadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_chat_thread(
    request: Request,
    title: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    user_id = _get_authenticated_user_id(request)

    new_thread = await chat_service.create_chat_thread(user_id=user_id, title=title)
    return CreateThreadResponse.model_validate(new_thread.model_dump())


@chat_router.get("/threads/{thread_id}/messages", response_model=List[MessageResponse])
async def get_chat_messages(
    request: Request,
    thread_id: str,
    chat_service: ChatService = Depends(get_chat_service),
):
    user_id = _get_authenticated_user_id(request)
    thread = await chat_service.get_chat_thread(thread_id, user_id=user_id)
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    messages = await chat_service.get_chat_messages(
        thread_id,
    )
    return [MessageResponse.model_validate(message.model_dump()) for message in messages]
