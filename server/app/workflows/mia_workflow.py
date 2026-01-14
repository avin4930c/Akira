from typing import TypedDict, Optional
from fastapi import Depends
import json
from langgraph.graph import START, END, StateGraph
from app.model.request.mia import ServiceJobRequest
from app.model.response.customer import CustomerResponse
from app.model.response.vehicle import VehicleResponse
from app.model.response.mia_plan import (
    TechnicalPlanResponse,
    EnrichedTechnicalPlan,
)
from app.clients.llm_clients.base_llm_client import BaseLLMClient
from app.clients.llm_clients.gemini_llm_client import get_gemini_llm_client
from app.clients.web_search_clients.base_web_search_client import BaseWebSearchClient
from app.clients.web_search_clients.tavily_client import get_tavily_client
from app.services.vehicle_service import VehicleService, get_vehicle_service
from app.services.customer_service import CustomerService, get_customer_service
from app.services.rag_service import RAGService, get_rag_service
from app.services.inventory_service import InventoryService, get_inventory_service
from app.utils.rag_utils import format_rag_context
from app.prompts.mia_prompts import (
    MIA_RAG_QUERY_GENERATION_PROMPT,
    MIA_WEB_SEARCH_QUERY_PROMPT,
    MIA_TECHNICAL_PLAN_PROMPT,
)


class MiaWorkflowState(TypedDict):
    service_job: ServiceJobRequest
    vehicle_data: Optional[VehicleResponse]
    customer_data: Optional[CustomerResponse]
    rag_context: Optional[str]
    web_search_results: Optional[str]
    technical_plan: Optional[TechnicalPlanResponse]
    enriched_plan: Optional[EnrichedTechnicalPlan]


class MiaWorkflow:
    def __init__(
        self,
        llm_provider: BaseLLMClient,
        vehicle_service: VehicleService,
        customer_service: CustomerService,
        rag_service: RAGService,
        inventory_service: InventoryService,
        web_search_client: BaseWebSearchClient,
    ):
        self.llm = llm_provider.get_llm_client()
        self.vehicle_service = vehicle_service
        self.customer_service = customer_service
        self.rag_service = rag_service
        self.inventory_service = inventory_service
        self.web_search_client = web_search_client

    async def fetch_service_job_data(self, state: MiaWorkflowState) -> MiaWorkflowState:
        vehicle_data = await self.vehicle_service.get_vehicle(
            state["service_job"].vehicle_id)
        customer_data = await self.customer_service.get_customer(
            state["service_job"].customer_id)

        return {
            "vehicle_data": vehicle_data,
            "customer_data": customer_data,
        }

    async def retrieve_internal_knowledge(self, state: MiaWorkflowState) -> MiaWorkflowState:
        vehicle_model = f"{state['vehicle_data'].make} {state['vehicle_data'].model}"
        
        formatted_prompt = MIA_RAG_QUERY_GENERATION_PROMPT.format_messages(
            service_info=state["service_job"].service_info,
            mechanic_notes=state["service_job"].mechanic_notes
        )
        response = await self.llm.ainvoke(formatted_prompt)
        search_query = response.content if hasattr(response, 'content') else str(response)
        
        chunks = await self.rag_service.retrieve(
            query=search_query.strip(),
            vehicle_model=vehicle_model,
            top_k=5,
        )

        context = format_rag_context(chunks)

        return {
            "rag_context": context
        }

    async def search_web(self, state: MiaWorkflowState) -> MiaWorkflowState:
        formatted_prompt = MIA_WEB_SEARCH_QUERY_PROMPT.format_messages(
            year=state["vehicle_data"].year,
            make=state["vehicle_data"].make,
            model=state["vehicle_data"].model,
            service_info=state["service_job"].service_info,
            mechanic_notes=state["service_job"].mechanic_notes,
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

    async def generate_technical_plan(self, state: MiaWorkflowState) -> MiaWorkflowState:
        json_schema = json.dumps(TechnicalPlanResponse.model_json_schema(), indent=2)
        
        formatted_prompt = MIA_TECHNICAL_PLAN_PROMPT.format_messages(
            customer_data=state["customer_data"].model_dump_json(indent=2),
            vehicle_data=state["vehicle_data"].model_dump_json(indent=2),
            service_info=state["service_job"].service_info,
            mechanic_notes=state["service_job"].mechanic_notes,
            rag_context=state["rag_context"] or "No internal documentation found.",
            web_search_results=state["web_search_results"] or "No external resources found.",
            json_schema=json_schema,
        )

        llm_output = await self.llm.ainvoke(formatted_prompt)

        if getattr(llm_output, "tool_calls", None):
            if len(llm_output.tool_calls) > 0:
                data = llm_output.tool_calls[0]["args"]
                technical_plan = TechnicalPlanResponse.model_validate(data)
                return {"technical_plan": technical_plan}

        try:
            data = json.loads(llm_output.content)
            technical_plan = TechnicalPlanResponse.model_validate(data)
            return {"technical_plan": technical_plan}
        except Exception as e:
            raise ValueError(
                f"Could not parse TechnicalPlanResponse.\nRaw content:\n{llm_output.content}"
            ) from e

    async def inventory_lookup(self, state: MiaWorkflowState) -> MiaWorkflowState:
        """Look up suggested parts in inventory and enrich the technical plan."""
        
        technical_plan = state.get("technical_plan")
        if not technical_plan:
            return {"enriched_plan": None}

        vehicle_data = state.get("vehicle_data")
        vehicle_model = None
        if vehicle_data:
            vehicle_model = f"{vehicle_data.make} {vehicle_data.model}"

        enriched = await self.inventory_service.enrich_technical_plan(
            technical_plan=technical_plan,
            vehicle_model=vehicle_model,
        )

        return {"enriched_plan": enriched}

    def get_workflow(self) -> StateGraph:
        builder = StateGraph(MiaWorkflowState)
        builder.add_node("service_job_data", self.fetch_service_job_data)
        builder.add_node("retrieve_internal_knowledge",
                         self.retrieve_internal_knowledge)
        builder.add_node("search_web", self.search_web)
        builder.add_node("generate_technical_plan", self.generate_technical_plan)
        builder.add_node("inventory_lookup", self.inventory_lookup)

        builder.add_edge(START, "service_job_data")
        builder.add_edge("service_job_data", "retrieve_internal_knowledge")
        builder.add_edge("service_job_data", "search_web")
        builder.add_edge("retrieve_internal_knowledge", "generate_technical_plan")
        builder.add_edge("search_web", "generate_technical_plan")
        builder.add_edge("generate_technical_plan", "inventory_lookup")
        builder.add_edge("inventory_lookup", END)

        return builder.compile()


def get_mia_workflow(
    llm_provider: BaseLLMClient = Depends(get_gemini_llm_client),
    customer_service: CustomerService = Depends(get_customer_service),
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    rag_service: RAGService = Depends(get_rag_service),
    inventory_service: InventoryService = Depends(get_inventory_service),
    web_search_client: BaseWebSearchClient = Depends(get_tavily_client),
):
    return MiaWorkflow(
        llm_provider=llm_provider,
        customer_service=customer_service,
        vehicle_service=vehicle_service,
        rag_service=rag_service,
        inventory_service=inventory_service,
        web_search_client=web_search_client,
    ).get_workflow()