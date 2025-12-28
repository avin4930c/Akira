from typing import List, Optional
import threading
from langchain_core.embeddings import Embeddings
from app.clients.embedding_clients.base_embedding_client import BaseEmbeddingClient
from app.settings.settings import settings
from app.config.logger_config import setup_logger

log = setup_logger(__name__)

class GenericHuggingFaceEmbeddings(Embeddings):
    def __init__(self, model_name: str, device: str = "cpu", instruction: Optional[str] = None):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name, device=device, trust_remote_code=True)
        self.instruction = instruction

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()

    def embed_query(self, text: str) -> List[float]:
        if self.instruction:
            text = f"{self.instruction}{text}"
             
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding.tolist()

class HuggingFaceEmbeddingClient(BaseEmbeddingClient):
    _client: GenericHuggingFaceEmbeddings | None = None
    _current_model_name: str | None = None
    _lock: threading.Lock = threading.Lock()

    def get_embedding_client(self) -> Embeddings:
        if HuggingFaceEmbeddingClient._client and HuggingFaceEmbeddingClient._current_model_name == self.model_name:
            return HuggingFaceEmbeddingClient._client

        with HuggingFaceEmbeddingClient._lock:
            if HuggingFaceEmbeddingClient._client and HuggingFaceEmbeddingClient._current_model_name == self.model_name:
                return HuggingFaceEmbeddingClient._client

            try:
                log.info(f"Initializing HF Embedding Client with model: {self.model_name} on {settings.LOCAL_EMBEDDING_DEVICE}")
                HuggingFaceEmbeddingClient._client = GenericHuggingFaceEmbeddings(
                    model_name=self.model_name,
                    device=settings.LOCAL_EMBEDDING_DEVICE,
                    instruction=settings.LOCAL_EMBEDDING_INSTRUCTION
                )
                HuggingFaceEmbeddingClient._current_model_name = self.model_name
                log.info("HF Embedding Client initialized successfully")
            except Exception as e:
                log.error(f"Error initializing HF Embedding client: {e}")
                raise RuntimeError(f"Failed to initialize HF Embedding client: {e}")

        return HuggingFaceEmbeddingClient._client

def get_huggingface_embedding_client(model_name: str | None = None) -> HuggingFaceEmbeddingClient:
    name = model_name or settings.LOCAL_EMBEDDING_MODEL_NAME
    return HuggingFaceEmbeddingClient(model_name=name)