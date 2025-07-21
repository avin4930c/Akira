from src.prompts.all_agents_prompt import GENERAL_AGENT_PROMPT

class GeneralAgent:
    def __init__(self, llm_service):
        self.llm_service = llm_service
        self.prompt = GENERAL_AGENT_PROMPT
        
    async def process_query(self, query: str, conversation_history: list = None):
        """
        Process General queries and determine if follow up questions are needed
        """
        
        messages = self._prepare_messages(query, conversation_history)
        response = await self.llm_service.generate_response(
            messages=messages,
            system_prompt=self.prompt
        )
        return response
        
    def _prepare_messages(self, query: str, conversation_history: list = None):
        if conversation_history is None:
            conversation_history = []
        return conversation_history + [{"role": "user", "content": query}]