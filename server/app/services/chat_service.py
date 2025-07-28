from app.services.llm.agent_selector import AgentSelector
from app.services.llm.agents.general_agent import GeneralAgent

class ChatManager:
    def __init__(self, llm_service = None):
        """ Initializes the ChatManager with the LLM service and agents
        """
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