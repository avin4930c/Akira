import asyncio
from fastapi import APIRouter, WebSocket
from src.app.services.groq.groq_client import GroqService
from src.app.services.llm.agent_selector import AgentSelector
from src.app.services.llm.agents.general_agent import GeneralAgent
from src.app.prompts.all_agents_prompt import BASE_PROMPT

class ChatManager:
    def __init__(self, llm_service):
        self.llm_service = llm_service
        self.agent_selector = AgentSelector(llm_service)
        self.general_agent = GeneralAgent(llm_service)
        self.conversation_history = []
        
    async def process_message(self, user_message: str):
        """
        Process incoming user message and return appropriate response
        """
        self.conversation_history.append({"role": "user", "content": user_message})
        
        agent_type = await self.agent_selector.select_agent(self.conversation_history)
        print("Agent Type: ", agent_type)
        
        response = await self._process_with_agent(agent_type, user_message)
        
        self.conversation_history.append({"role": "assistant", "content": response})
        
        return response
    
    async def _process_with_agent(self, agent_type: str, query: str):
        """
        Route the query to the appropriate agent
        """
        if agent_type == "general_agent":
            return await self.general_agent.process_query(query, self.conversation_history)
        # elif agent_type == "recommendation_agent":
        #     return await self.recommendation_agent.process_query(query, self.conversation_history)
        # elif agent_type == "troubleshooting_agent":
        #     return await self.troubleshooting_agent.process_query(query, self.conversation_history)
        else:
            return "I'm not sure how to handle that request."

chat_router = APIRouter()

@chat_router.websocket("/chat")
async def chat_websocket(websocket: WebSocket):
    await websocket.accept()
    
    llm_service = GroqService()
    chat_manager =  ChatManager(llm_service)
    

    while True:
        user_query = await websocket.receive_text()
        
        response = await chat_manager.process_message(user_query)
            
        await websocket.send_text(response)
        
        