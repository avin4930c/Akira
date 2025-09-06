from langchain_google_genai import ChatGoogleGenerativeAI
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.settings.settings import settings
from app.config.logger_config import setup_logger

log = setup_logger(__name__)


class GeminiLLMClient(BaseLLMClient):
    _client: ChatGoogleGenerativeAI | None = None

    def get_llm_client(self) -> ChatGoogleGenerativeAI:
        if self._client:
            return self._client

        try:
            self._client = ChatGoogleGenerativeAI(
                model=self.model_name,
                google_api_key=settings.GEMINI_API_KEY,
            )
        except Exception as e:
            log.error(f"Error initializing Gemini LLM client: {e}")
            raise RuntimeError(f"Failed to initialize Gemini LLM client: {e}")

        return self._client


def get_gemini_llm_client(model_name: str = "gemini-2.5-flash") -> GeminiLLMClient:
    return GeminiLLMClient(model_name=model_name)
