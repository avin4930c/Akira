import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import StreamingResponse

from app.config.logger_config import setup_logger
from app.core.sse_manager import SSEManager, get_sse_manager
from app.model.request.service_job import ServiceJobRequest, UpdateAdditionalNotesRequest
from app.model.response.service_job import ServiceJobResponse, ServiceJobListResponse
from app.constants.enums.mia_enums import ProcessingStage
from app.services.mia_service import MiaService, get_mia_service, run_mia_workflow_background
from app.utils.mia_utils import service_job_to_response

mia_router = APIRouter()
log = setup_logger(__name__)


@mia_router.post("/service-jobs", response_model=ServiceJobResponse, status_code=status.HTTP_201_CREATED)
async def create_service_job(
    payload: ServiceJobRequest,
    background_tasks: BackgroundTasks,
    mia_service: MiaService = Depends(get_mia_service),
):
    service_job = await mia_service.create_service_job(payload)
    
    background_tasks.add_task(
        run_mia_workflow_background,
        service_job.id,
    )
    
    log.info(f"Started processing for job {service_job.id}")
    return service_job_to_response(service_job)


@mia_router.get("/service-jobs/{job_id}/status/stream")
async def stream_job_status(
    job_id: str,
    sse_manager: SSEManager = Depends(get_sse_manager),
    mia_service: MiaService = Depends(get_mia_service),
):
    service_job = await mia_service.get_service_job_by_id(job_id)
    if not service_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service job {job_id} not found"
        )
        
    media_type = "text/event-stream"
    headers = {
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
    }
    
    if service_job.processing_stage in [ProcessingStage.completed, ProcessingStage.failed]:
        async def immediate_response():
            stage = service_job.processing_stage
            event_type = "completed" if stage == ProcessingStage.completed else "error"
            data = json.dumps({
                "event_id": job_id,
                "stage": stage.value,
                "stage_label": stage.label,
                "progress": stage.progress,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "error": service_job.error_details,
            })
            yield f"event: {event_type}\ndata: {data}\n\n"
            yield f"event: close\ndata: {{\"event_id\": \"{job_id}\"}}\n\n"

            await sse_manager.unsubscribe(job_id)
        
        return StreamingResponse(
            immediate_response(),
            media_type=media_type,
            headers=headers,
        )
    
    return StreamingResponse(
        sse_manager.subscribe(job_id),
        media_type=media_type,
        headers=headers,
    )


@mia_router.get("/service-jobs/{job_id}", response_model=ServiceJobResponse)
async def get_service_job(
    job_id: str,
    mia_service: MiaService = Depends(get_mia_service),
):
    service_job = await mia_service.get_service_job_by_id(job_id)
    if not service_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service job {job_id} not found"
        )
    
    return service_job_to_response(service_job)


@mia_router.get("/service-jobs", response_model=list[ServiceJobListResponse])
async def list_service_jobs(
    vehicle_id: Optional[str] = None,
    mia_service: MiaService = Depends(get_mia_service),
):
    return await mia_service.list_service_jobs(vehicle_id=vehicle_id)


@mia_router.patch("/service-jobs/{job_id}/validate", response_model=ServiceJobResponse)
async def validate_service_job(
    job_id: str,
    mia_service: MiaService = Depends(get_mia_service),
):
    try:
        service_job = await mia_service.validate_service_job(job_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    return service_job_to_response(service_job)


@mia_router.patch("/service-jobs/{job_id}/notes", response_model=ServiceJobResponse)
async def update_additional_notes(
    job_id: str,
    payload: UpdateAdditionalNotesRequest,
    mia_service: MiaService = Depends(get_mia_service),
):
    try:
        if not payload.additional_notes:
            raise ValueError("Additional notes cannot be empty")
        
        service_job = await mia_service.update_additional_notes(job_id, payload.additional_notes)
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    
    return service_job_to_response(service_job)