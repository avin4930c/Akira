from abc import ABC, abstractmethod

from langchain_core.language_models import BaseLanguageModel


class BaseLLMClient(ABC):
    def __init__(self, model_name: str):
        self.model_name = model_name

    @abstractmethod
    def get_llm_client(self) -> BaseLanguageModel:
        raise NotImplementedError("Subclasses must implement this method")
