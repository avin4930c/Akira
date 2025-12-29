from fastapi import Depends
from langgraph.graph import START, END, StateGraph, MessagesState
from app.model.request.mia import ServiceJobRequest
from app.model.response.customer import CustomerResponse
from app.model.response.vehicle import VehicleResponse
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.clients.llm_clients.gemini_llm_client import get_gemini_llm_client
from app.clients.web_search_clients.base_web_search_client import BaseWebSearchClient
from app.clients.web_search_clients.tavily_client import get_tavily_client
from app.services.vehicle_service import VehicleService, get_vehicle_service
from app.services.customer_service import CustomerService, get_customer_service
from app.services.rag_service import RAGService, get_rag_service
from app.prompts.mia_prompts import (
    MIA_RAG_QUERY_GENERATION_PROMPT,
    MIA_WEB_SEARCH_QUERY_PROMPT,
)


class MiaWorkflowState(MessagesState):
    service_job: ServiceJobRequest
    vehicle_data: VehicleResponse = None
    customer_data: CustomerResponse = None
    rag_context: str = None
    web_search_results: str = None


class MiaWorkflow:
    def __init__(
        self,
        llm_provider: BaseLLMClient,
        vehicle_service: VehicleService,
        customer_service: CustomerService,
        rag_service: RAGService,
        web_search_client: BaseWebSearchClient,
    ):
        self.llm = llm_provider.get_llm_client()
        self.vehicle_service = vehicle_service
        self.customer_service = customer_service
        self.rag_service = rag_service
        self.web_search_client = web_search_client

    async def fetch_service_job_data(self, state: MiaWorkflowState) -> MiaWorkflowState:
        vehicle_data = await self.vehicle_service.get_vehicle(
            state.service_job.vehicle_id)
        customer_data = await self.customer_service.get_customer(
            state.service_job.customer_id)

        return {
            "vehicle_data": vehicle_data,
            "customer_data": customer_data,
        }

    async def retrieve_internal_knowledge(self, state: MiaWorkflowState) -> MiaWorkflowState:
        vehicle_model = f"{state.vehicle_data.make} {state.vehicle_data.model}"
        
        formatted_prompt = MIA_RAG_QUERY_GENERATION_PROMPT.format_messages(
            service_info=state.service_job.service_info,
            mechanic_notes=state.service_job.mechanic_notes
        )
        response = await self.llm.ainvoke(formatted_prompt)
        search_query = response.content if hasattr(response, 'content') else str(response)
        
        context = await self.rag_service.retrieve(
            query=search_query.strip(),
            vehicle_model=vehicle_model,
            top_k=5,
        )

        return {
            "rag_context": context
        }

    async def search_web(self, state: MiaWorkflowState) -> MiaWorkflowState:
        formatted_prompt = MIA_WEB_SEARCH_QUERY_PROMPT.format_messages(
            year=state.vehicle_data.year,
            make=state.vehicle_data.make,
            model=state.vehicle_data.model,
            service_info=state.service_job.service_info,
            mechanic_notes=state.service_job.mechanic_notes,
        )
        response = await self.llm.ainvoke(formatted_prompt)
        search_query = response.content if hasattr(response, "content") else str(response)

        results = await self.web_search_client.search(
            query=search_query.strip(),
            max_results=5,
            search_depth="advanced",
        )

        web_context = self.web_search_client.format_results_as_context(results)

        return {"web_search_results": web_context}

    async def mechanic_brain_planner(self, state: MiaWorkflowState):
        pass

    async def inventory_lookup(self, state: MiaWorkflowState):
        pass

    def get_workflow(self) -> StateGraph:
        builder = StateGraph(MiaWorkflowState)
        builder.add_node("service_job_data", self.fetch_service_job_data)
        builder.add_node("retrieve_internal_knowledge",
                         self.retrieve_internal_knowledge)
        builder.add_node("search_web", self.search_web)
        builder.add_node("mechanic_brain_planner", self.mechanic_brain_planner)
        builder.add_node("inventory_lookup", self.inventory_lookup)

        builder.add_edge(START, "service_job_data")
        builder.add_edge("service_job_data", "retrieve_internal_knowledge")
        builder.add_edge("service_job_data", "search_web")
        builder.add_edge("retrieve_internal_knowledge", "mechanic_brain_planner")
        builder.add_edge("search_web", "mechanic_brain_planner")
        builder.add_edge("mechanic_brain_planner", "inventory_lookup")
        builder.add_edge("inventory_lookup", END)
        
        return builder.compile()


def get_mia_workflow(
    llm_provider: BaseLLMClient = Depends(get_gemini_llm_client),
    customer_service: CustomerService = Depends(get_customer_service),
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    rag_service: RAGService = Depends(get_rag_service),
    web_search_client: BaseWebSearchClient = Depends(get_tavily_client),
):
    return MiaWorkflow(
        llm_provider=llm_provider,
        customer_service=customer_service,
        vehicle_service=vehicle_service,
        rag_service=rag_service,
        web_search_client=web_search_client,
    ).get_workflow()
