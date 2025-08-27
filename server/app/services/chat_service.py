from fastapi import Depends
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.clients.llm_clients.gemini_llm_client import get_gemini_llm_client
from langgraph.graph import START, StateGraph, MessagesState
from langchain_core.messages import SystemMessage
from langgraph.checkpoint.memory import MemorySaver


class ChatService:
    def __init__(self, llm_provider: BaseLLMClient = None,):
        self.llm_provider = llm_provider
        self.llm = None
        self.sys_msg = [SystemMessage(
            content="You are a motorcycle assistant that helps users with motorcycle-related queries. You provide information, advice, and assistance related to motorcycles.")]
        self.react_graph = None

    def _initialize_builder(self):
        builder = StateGraph(MessagesState)
        builder.add_node("assistant", self.assistant)

        builder.add_edge(START, "assistant")

        self.react_graph = builder.compile(checkpointer=MemorySaver())

    async def _ensure_llm_initialized(self):
        if self.llm is None:
            self.llm = await self.llm_provider.get_llm_client()

    async def _ensure_react_graph_initialized(self):
        if self.react_graph is None:
            self._initialize_builder()

    async def assistant(self, state: MessagesState):
        await self._ensure_llm_initialized()
        response = await self.llm.ainvoke(self.sys_msg + state["messages"])
        return {"messages": [response]}

    async def process_message(self, user_query: str):
        await self._ensure_react_graph_initialized()
        config = {"configurable": {"thread_id": "1"}}
        return await self.react_graph.ainvoke({"messages": user_query}, config)


def get_chat_service(llm_provider: BaseLLMClient = Depends(get_gemini_llm_client)) -> ChatService:
    return ChatService(llm_provider=llm_provider)
