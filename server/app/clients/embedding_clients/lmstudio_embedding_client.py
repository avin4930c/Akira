from typing import List
import threading
import httpx
from langchain_core.embeddings import Embeddings
from app.clients.embedding_clients.base_embedding_client import BaseEmbeddingClient
from app.settings.settings import settings
from app.config.logger_config import setup_logger

log = setup_logger(__name__)


class LMStudioEmbeddings(Embeddings):
    def __init__(self, base_url: str, model_name: str, timeout: float = 60.0):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name
        self._client = httpx.AsyncClient(timeout=timeout)

    async def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        url = f"{self.base_url}/v1/embeddings"

        payload = {
            "model": self.model_name,
            "input": texts,
        }

        try:
            response = await self._client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            embedding_data = sorted(data["data"], key=lambda x: x["index"])
            return [item["embedding"] for item in embedding_data]
        except httpx.HTTPStatusError as e:
            log.error(f"LM Studio API error: {e.response.status_code} - {e.response.text}")
            raise RuntimeError("LM Studio embedding API request failed") from e
        except httpx.RequestError as e:
            log.error(f"LM Studio connection error: {e}")
            raise RuntimeError(f"Failed to connect to LM Studio at {self.base_url}") from e

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of documents."""
        if not texts:
            return []
        return await self._get_embeddings(texts)
    
    async def embed_query(self, text: str) -> List[float]:
        """Embed a single query text."""
        embeddings = await self._get_embeddings([text])
        return embeddings[0]

    async def close(self) -> None:
        await self._client.aclose()


class LMStudioEmbeddingClient(BaseEmbeddingClient):
    _client: LMStudioEmbeddings | None = None
    _current_model_name: str | None = None
    _lock: threading.Lock = threading.Lock()

    def get_embedding_client(self) -> Embeddings:
        if (
            LMStudioEmbeddingClient._client is not None
            and LMStudioEmbeddingClient._current_model_name == self.model_name
        ):
            return LMStudioEmbeddingClient._client

        with LMStudioEmbeddingClient._lock:
            if (
                LMStudioEmbeddingClient._client is not None
                and LMStudioEmbeddingClient._current_model_name == self.model_name
            ):
                return LMStudioEmbeddingClient._client

            try:
                log.info(
                    f"Initializing LM Studio Embedding Client with model: {self.model_name} "
                    f"at {settings.LMSTUDIO_EMBEDDING_URL}"
                )
                if LMStudioEmbeddingClient._client is not None:
                    LMStudioEmbeddingClient._client.close()

                LMStudioEmbeddingClient._client = LMStudioEmbeddings(
                    base_url=settings.LMSTUDIO_EMBEDDING_URL,
                    model_name=self.model_name,
                )
                LMStudioEmbeddingClient._current_model_name = self.model_name
                log.info("LM Studio Embedding Client initialized successfully")
            except Exception as e:
                log.error(f"Error initializing LM Studio Embedding client: {e}")
                raise RuntimeError(
                    "Failed to initialize LM Studio Embedding client"
                ) from e

        return LMStudioEmbeddingClient._client

def get_lmstudio_embedding_client(model_name: str = settings.LMSTUDIO_EMBEDDING_MODEL) -> LMStudioEmbeddingClient:
    return LMStudioEmbeddingClient(model_name=model_name)