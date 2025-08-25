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
        self.sys_msg = [SystemMessage(content="You are a motorcycle assistant that helps users with motorcycle-related queries. You provide information, advice, and assistance related to motorcycles.")]
        self.react_graph = None

    def _initialize_builder(self):
        builder = StateGraph(MessagesState)
        builder.add_node("assistant", self.assistant)

        builder.add_edge(START, "assistant")
        
        self.react_graph = builder.compile(checkpointer=MemorySaver())
        
    async def _ensure_llm_initialized(self):
        if self.llm is None:
            self.llm = await self.llm_provider.get_llm_client()

    def assistant(self, state: MessagesState):
        self._ensure_llm_initialized()
        return {"messages": [self.llm.invoke(self.sys_msg) + state["messages"]]}
                    
    async def process_message(self, messages: MessagesState):
        return await self.react_graph.invoke({"messages": messages})
    # async def process_message(self, user_message: str):
    #     """
    #     Process incoming user message and return appropriate response
    #     """
    #     self.conversation_history.append({"role": "user", "content": user_message})
        
    #     agent_type = await self.agent_selector.select_agent(self.conversation_history)
    #     print("Agent Type: ", agent_type)
        
    #     response = await self._process_with_agent(agent_type, user_message)
        
    #     self.conversation_history.append({"role": "assistant", "content": response})
        
    #     return response
    
    # async def _process_with_agent(self, agent_type: str, query: str):
    #     """
    #     Route the query to the appropriate agent
    #     """
    #     if agent_type == "general_agent":
    #         return await self.general_agent.process_query(query, self.conversation_history)
    #     # elif agent_type == "recommendation_agent":
    #     #     return await self.recommendation_agent.process_query(query, self.conversation_history)
    #     # elif agent_type == "troubleshooting_agent":
    #     #     return await self.troubleshooting_agent.process_query(query, self.conversation_history)
    #     else:
    #         return "I'm not sure how to handle that request."
        
def get_chat_service(llm_provider: BaseLLMClient = Depends(get_gemini_llm_client)) -> ChatService:
    return ChatService(llm_provider=llm_provider)