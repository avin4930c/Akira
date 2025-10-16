from fastapi import Depends
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.clients.llm_clients.gemini_llm_client import get_gemini_llm_client
from app.prompts.motorcycle_assistant_prompt import MOTORCYCLE_ASSISTANT_PROMPT
from app.prompts.summarization_prompt import SUMMARIZATION_PROMPT
from app.prompts.thread_title_prompt import THREAD_TITLE_PROMPT
from app.utils.chat_utils import convert_chat_history_to_string
from app.constants.chat import INITIAL_SUMMARY_CHAT__MESSAGES_LIMIT, THREAD_TITLE_UPDATE_MESSAGE_THRESHOLD, THREAD_TITLE_MAX_LENGTH

class ChatWorkflowState(MessagesState):
    query: str = None
    thread_id: str = None
    thread_title: str = None
    thread_updated: bool = False
    last_summary_message_id: str = None
    summary: str = None
    summary_updated: bool = False
    db_message_count: int = 0


class ChatWorkflow:
    def __init__(
        self,
        llm_provider: BaseLLMClient = None,
    ):
        self.llm = llm_provider.get_llm_client()

    async def assistant(self, state: ChatWorkflowState):
        message_history = state["messages"]
        query = state["query"]
        summary = state.get("summary", "")

        chat_history_str = convert_chat_history_to_string(message_history)

        formatted_prompt = MOTORCYCLE_ASSISTANT_PROMPT.format_messages(
            context="",  # Add Tavily search results here later
            summary=summary,
            chat_history=chat_history_str,
            query=query,
        )

        async for chunk in self.llm.astream(formatted_prompt):
            if hasattr(chunk, "content") and chunk.content:
                yield {"messages": [chunk]}
        
    def _should_update_title(self, state: ChatWorkflowState):
        if state["db_message_count"] <= THREAD_TITLE_UPDATE_MESSAGE_THRESHOLD:
            return True
        else:
            return False
    
    async def update_title(self, state: ChatWorkflowState):
        current_title = state.get("thread_title", "")
        message_history = convert_chat_history_to_string(state["messages"])
        
        formatted_prompt = THREAD_TITLE_PROMPT.format_messages(
            current_title=current_title,
            conversation=message_history,
        )
        
        op = self.llm.invoke(formatted_prompt)
        new_title = op.content.strip()
        
        thread_title_updated = new_title != current_title and new_title != "UNSURE" and len(new_title) <= THREAD_TITLE_MAX_LENGTH
        
        return {
            "thread_title": new_title if thread_title_updated else current_title,
            "thread_updated": thread_title_updated,
        }
                
    def _should_summarize(self, state: ChatWorkflowState):
        if state["db_message_count"] < INITIAL_SUMMARY_CHAT__MESSAGES_LIMIT:
            return False
        
        message_ids = [msg.id for msg in state["messages"]]
        last_summary_message_id = state.get("last_summary_message_id")
        
        if not last_summary_message_id:
            return True
        
        if last_summary_message_id not in message_ids:
            return True
        else:
            return False
    
    def _post_assistant_route(self, state: ChatWorkflowState):
        if self._should_update_title(state):
            return "update_title"
        elif self._should_summarize(state):
            return "summarize"
        else:
            return END
    
    def _post_title_route(self, state: ChatWorkflowState):
        if self._should_summarize(state):
            return "summarize"
        else:
            return END
        
    async def summarize(self, state: ChatWorkflowState):
        summary = state.get("summary", "")
        message_history = convert_chat_history_to_string(state["messages"])
        
        formatted_prompt = SUMMARIZATION_PROMPT.format_messages(
            existing_summary=summary,
            conversation_messages=message_history
        )
        
        op = self.llm.invoke(formatted_prompt)
        new_summary = op.content.strip()
        
        return {
            "summary": new_summary,
            "summary_updated": True,
        }

    def get_workflow(self):
        builder = StateGraph(ChatWorkflowState)
        builder.add_node("assistant", self.assistant)
        builder.add_node("summarize", self.summarize)
        builder.add_node("update_title", self.update_title)

        builder.add_edge(START, "assistant")
        builder.add_conditional_edges(
            "assistant",
            self._post_assistant_route,
            {
                "update_title": "update_title",
                "summarize": "summarize",
                END: END,
            },
        )
        builder.add_conditional_edges(
            "update_title",
            self._post_title_route,
            {
                "summarize": "summarize",
                END: END,
            },
        )
        builder.add_edge("summarize", END)

        return builder.compile(checkpointer=MemorySaver())


def get_chat_workflow(
    llm_provider: BaseLLMClient = Depends(get_gemini_llm_client),
) -> ChatWorkflow:
    return ChatWorkflow(llm_provider=llm_provider).get_workflow()
