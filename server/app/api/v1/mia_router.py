from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from langgraph.graph.state import CompiledStateGraph

from app.config.logger_config import setup_logger
from app.workflows.mia_workflow import get_mia_workflow
from app.model.request.mia import ServiceJobRequest
from app.model.response.mia_plan import TechnicalPlanResponse

mia_router = APIRouter()
log = setup_logger(__name__)


@mia_router.post("/process", response_model=Optional[TechnicalPlanResponse])
async def process_service_job(
    request: ServiceJobRequest,
    workflow: CompiledStateGraph = Depends(get_mia_workflow),
):
    try:
        result_state = await workflow.ainvoke({
            "service_job": request,
        })
        
        return result_state.get("technical_plan")
    except Exception as e:
        log.error(f"Error processing service job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process service job"
        )