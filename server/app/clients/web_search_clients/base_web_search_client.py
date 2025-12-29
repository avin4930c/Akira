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
    async def search(
        self,
        query: str,
        max_results: int = 5,
        search_depth: str | None = None,
        include_domains: list[str] | None = None,
    ) -> list[WebSearchResult]:
        """
        Perform a web search and return results.

        Args:
            query: The search query string
            max_results: Maximum number of results to return
            search_depth: Optional search depth hint (implementation-specific);
                implementations may ignore this parameter.
            include_domains: Optional list of domains to prioritize or restrict search to;
                implementations may ignore this parameter.

        Returns:
            List of WebSearchResult objects
        """
        raise NotImplementedError("Subclasses must implement this method")

    @abstractmethod
    def format_results_as_context(self, results: list[WebSearchResult]) -> str:
        """
        Format search results into a context string for LLM consumption.

        Args:
            results: List of WebSearchResult objects

        Returns:
            Formatted string containing all search results
        """
        raise NotImplementedError("Subclasses must implement this method")