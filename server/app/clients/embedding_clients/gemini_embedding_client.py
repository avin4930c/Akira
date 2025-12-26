from google.oauth2 import service_account
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.clients.embedding_clients.base_embedding_client import BaseEmbeddingClient
from app.settings.settings import settings
from app.config.logger_config import setup_logger

log = setup_logger(__name__)

class GeminiEmbeddingClient(BaseEmbeddingClient):
    _client: GoogleGenerativeAIEmbeddings | None = None

    def get_embedding_client(self) -> GoogleGenerativeAIEmbeddings:
        if self._client:
            return self._client

        if not settings.VERTEX_SERVICE_ACCOUNT_JSON_PATH:
            raise RuntimeError(
                "VERTEX_SERVICE_ACCOUNT_JSON_PATH is not configured. "
                "Please set this environment variable to the path of your GCP service account JSON file."
            )
        
        if not settings.GCP_PROJECT_ID:
            raise RuntimeError(
                "GCP_PROJECT_ID is not configured. "
                "Please set this environment variable to your Google Cloud project ID."
            )

        try:
            creds = service_account.Credentials.from_service_account_file(
                settings.VERTEX_SERVICE_ACCOUNT_JSON_PATH
            )
            self._client = GoogleGenerativeAIEmbeddings(
                model=self.model_name,
                vertexai=True,
                project=settings.GCP_PROJECT_ID,
                credentials=creds,
            )
        except FileNotFoundError:
            raise RuntimeError(
                f"Service account file not found at: {settings.VERTEX_SERVICE_ACCOUNT_JSON_PATH}. "
                "Please verify the path is correct."
            )
        except Exception as e:
            log.error(f"Error initializing Gemini Embedding client: {e}")
            raise RuntimeError(f"Failed to initialize Gemini Embedding client: {e}")

        return self._client

def get_gemini_embedding_client(model_name: str = "models/gemini-embedding-001") -> GeminiEmbeddingClient:
    return GeminiEmbeddingClient(model_name=model_name)