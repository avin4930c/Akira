from abc import ABC, abstractmethod
from langchain_core.embeddings import Embeddings

class BaseEmbeddingClient(ABC):
    def __init__(self, model_name: str):
        self.model_name = model_name

    @abstractmethod
    def get_embedding_client(self) -> Embeddings:
        raise NotImplementedError("Subclasses must implement this method")
