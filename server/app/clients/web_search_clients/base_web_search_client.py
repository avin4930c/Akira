from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class WebSearchResult:
    title: str
    url: str
    content: str
    score: float
    raw_content: dict | None = None


class BaseWebSearchClient(ABC):
    @abstractmethod
    async def search(self, query: str, max_results: int = 5) -> list[WebSearchResult]:
        """
        Perform a web search and return results.
        
        Args:
            query: The search query string
            max_results: Maximum number of results to return
            
        Returns:
            List of WebSearchResult objects
        """
        raise NotImplementedError("Subclasses must implement this method")