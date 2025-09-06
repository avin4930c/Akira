from fastapi import Depends
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.clients.llm_clients.gemini_llm_client import get_gemini_llm_client
from app.prompts.motorcycle_assistant_prompt import MOTORCYCLE_ASSISTANT_PROMPT

class ChatWorkflowState(MessagesState):
    query: str = None
    thread_id: str = None


class ChatWorkflow:
    def __init__(self, llm_provider: BaseLLMClient = None,):
        self.llm = llm_provider.get_llm_client()

    async def assistant(self, state: ChatWorkflowState):
        message_history = state["messages"]
        query = state["query"]
        
        chat_history_str = ""
        for msg in message_history:
            if hasattr(msg, 'content'):
                role = "Human" if msg.__class__.__name__ == "HumanMessage" else "Assistant"
                chat_history_str += f"{role}: {msg.content}\n"
        
        formatted_prompt = MOTORCYCLE_ASSISTANT_PROMPT.format_messages(
            context="",  # Add Tavily search results here later
            chat_history=chat_history_str,
            query=query
        )
                
        full_content = ""
        async for chunk in self.llm.astream(formatted_prompt):
            if hasattr(chunk, 'content') and chunk.content:
                full_content += chunk.content
                yield {"messages": [chunk]}
                
    def get_workflow(self):
        builder = StateGraph(ChatWorkflowState)
        builder.add_node("assistant", self.assistant)

        builder.add_edge(START, "assistant")
        builder.add_edge("assistant", END)

        return builder.compile(checkpointer=MemorySaver())
            
            
def get_chat_workflow(
    llm_provider: BaseLLMClient = Depends(get_gemini_llm_client)
) -> ChatWorkflow:
    return ChatWorkflow(llm_provider=llm_provider).get_workflow()
