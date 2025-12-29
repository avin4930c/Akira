from tavily import AsyncTavilyClient
from app.clients.web_search_clients.base_web_search_client import (
    BaseWebSearchClient,
    WebSearchResult,
)
from app.settings.settings import settings
from app.config.logger_config import setup_logger

log = setup_logger(__name__)


class TavilyWebSearchClient(BaseWebSearchClient):
    _client: AsyncTavilyClient | None = None

    def _get_client(self) -> AsyncTavilyClient:
        if self._client:
            return self._client

        if not settings.TAVILY_API_KEY:
            raise RuntimeError(
                "TAVILY_API_KEY is not configured. Please set this environment variable to your Tavily API key."
                )

        try:
            self._client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)
        except Exception as e:
            log.error(f"Error initializing Tavily client: {e}")
            raise RuntimeError(f"Failed to initialize Tavily client: {e}")

        return self._client

    async def search(
        self,
        query: str,
        max_results: int = 5,
        search_depth: str = "advanced",
        include_domains: list[str] | None = None,
    ) -> list[WebSearchResult]:
        client = self._get_client()

        try:
            response = await client.search(
                query=query,
                max_results=max_results,
                search_depth=search_depth,
                include_domains=include_domains,
            )

            results = []
            for result in response.get("results", []):
                results.append(
                    WebSearchResult(
                        title=result.get("title", ""),
                        url=result.get("url", ""),
                        content=result.get("content", ""),
                        score=result.get("score", 0.0),
                        raw_content=result.get("raw_content", {}),
                    )
                )

            log.info(f"Tavily search returned {len(results)} results for query: {query[:50]}...")
            return results

        except Exception as e:
            log.error(f"Error performing Tavily search: {e}")
            return []

    def format_results_as_context(self, results: list[WebSearchResult]) -> str:
        if not results:
            return "No relevant web search results found."

        formatted_parts = ["## Web Search Results\n"]

        for i, result in enumerate(results, 1):
            formatted_parts.append(f"### Source {i}: {result.title}")
            formatted_parts.append(f"URL: {result.url}")
            formatted_parts.append(f"Content: {result.content}\n")

        return "\n".join(formatted_parts)


def get_tavily_client() -> TavilyWebSearchClient:
    return TavilyWebSearchClient()