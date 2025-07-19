from src.app.prompts.all_agents_prompt import BASE_PROMPT

class AgentSelector:
    def __init__(self, llm_service):
        self.llm_service = llm_service
        self.base_prompt = BASE_PROMPT

    async def select_agent(self, messages):
        """
        Determines which agent should handle the user query
        """
        
        print(messages)
        response = await self.llm_service.generate_response(
            messages=messages,
            system_prompt=self.base_prompt
        )
        return response