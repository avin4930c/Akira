from fastapi import APIRouter, Depends, HTTPException, status
from langgraph.graph.state import CompiledStateGraph

from app.config.logger_config import setup_logger
from app.workflows.mia_workflow import get_mia_workflow, MiaWorkflowState
from app.model.request.mia import ServiceJobRequest
from app.model.response.mia import ServiceJobResponse

mia_router = APIRouter()
log = setup_logger(__name__)


@mia_router.post("/process", response_model=ServiceJobResponse)
async def process_service_job(
    request: ServiceJobRequest,
    workflow: CompiledStateGraph = Depends(get_mia_workflow),
):
    #TODO: Add mia workflow processing logic here
    try:
        pass  # Replace with actual workflow execution
    except Exception as e:
        log.error(f"Error processing service job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process service job"
        )