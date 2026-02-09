from datetime import datetime
from typing import Optional
from fastapi import Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from langgraph.graph.state import CompiledStateGraph
from app.core.database import get_session, async_engine
from app.core.sse_manager import SSEManager, get_sse_manager, sse_manager as global_sse_manager
from app.workflows.mia_workflow import create_mia_workflow_with_session
from app.model.request.service_job import ServiceJobRequest
from app.constants.enums.mia_enums import ServiceJobStatus, ProcessingStage
from app.model.response.mia import EnrichedTechnicalPlan, MiaStageEvent
from app.model.response.service_job import ServiceJobListResponse
from app.model.sql_models.mia import ServiceJob
from app.constants.mia import MIA_ADDITIONAL_NOTES_MAX_LENGTH
from app.utils.mia_utils import service_job_to_response, service_job_to_list_response


class MiaService:
    def __init__(self, session: AsyncSession, sse_manager: SSEManager):
        self.session = session
        self.sse_manager = sse_manager
        
    async def create_service_job(self, service_job_data: ServiceJobRequest) -> ServiceJob:
        service_job = ServiceJob(
            **service_job_data.model_dump(),
            processing_stage=ProcessingStage.queued,
        )
        
        self.session.add(service_job)
        await self.session.commit()
        
        job_id = service_job_data.id
        return await self.get_service_job_by_id(job_id)
    
    async def update_processing_stage(
        self,
        job_id: str,
        stage: ProcessingStage,
        error: Optional[str] = None,
    ) -> ServiceJob:
        service_job = await self.get_service_job_by_id(job_id)
        if not service_job:
            raise ValueError(f"Service job {job_id} not found")
        
        service_job.processing_stage = stage
        service_job.stage_updated_at = datetime.utcnow()
        
        if stage == ProcessingStage.completed:
            service_job.status = ServiceJobStatus.completed
        elif stage == ProcessingStage.failed:
            service_job.status = ServiceJobStatus.failed
            service_job.error_details = error
        elif stage != ProcessingStage.queued:
            service_job.status = ServiceJobStatus.in_progress
        
        self.session.add(service_job)
        await self.session.commit()
        await self.session.refresh(service_job)
        
        event_type = "completed" if stage == ProcessingStage.completed else (
            "error" if stage == ProcessingStage.failed else "stage_update"
        )
        
        event_data = MiaStageEvent(
            stage=stage.value,
            stage_label=stage.label,
            progress=stage.progress,
            error=error,
        )
        await self.sse_manager.publish(
            event_id=job_id,
            data=event_data.model_dump(),
            event_type=event_type,
        )
        
        return service_job
    
    def create_stage_callback(self, job_id: str):
        async def update_stage(stage: ProcessingStage, error: Optional[str] = None):
            await self.update_processing_stage(job_id, stage, error)
        
        return update_stage
    
    async def run_workflow(
        self,
        job_id: str,
        workflow: CompiledStateGraph,
    ) -> None:
        try:
            service_job = await self.get_service_job_by_id(job_id)
            if not service_job:
                raise ValueError(f"Service job {job_id} not found")
            
            service_job_response = service_job_to_response(service_job)
            
            update_stage = self.create_stage_callback(job_id)
                        
            result_state = await workflow.ainvoke({
                "service_job": service_job_response,
                "update_stage": update_stage,
            })
            
            enriched_plan = result_state.get("enriched_plan")
            if enriched_plan:
                await self.save_enriched_plan(job_id, enriched_plan)
            else:
                await self.mark_failed(job_id, "Workflow completed but no plan generated")
                
        except Exception as e:
            await self.mark_failed(job_id, str(e))
    
    async def get_service_job_by_id(self, job_id: str) -> ServiceJob | None:
        statement = (
            select(ServiceJob)
            .where(ServiceJob.id == job_id)
            .options(selectinload(ServiceJob.customer), selectinload(ServiceJob.vehicle))
        )
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()
    
    async def list_service_jobs(
        self,
        vehicle_id: Optional[str] = None,
        status: Optional[ServiceJobStatus] = None,
        limit: int = 50,
    ) -> list[ServiceJobListResponse]:
        statement = (
            select(ServiceJob)
            .options(selectinload(ServiceJob.customer), selectinload(ServiceJob.vehicle))
        )
        
        if vehicle_id:
            statement = statement.where(ServiceJob.vehicle_id == vehicle_id)
        if status:
            statement = statement.where(ServiceJob.status == status)
            
        statement = statement.order_by(ServiceJob.created_at.desc()).limit(limit)
        
        result = await self.session.execute(statement)
        jobs = list(result.scalars().all())
        
        return [service_job_to_list_response(job) for job in jobs]
    
    async def save_enriched_plan(
        self,
        job_id: str,
        enriched_plan: EnrichedTechnicalPlan,
    ) -> ServiceJob:
        service_job = await self.get_service_job_by_id(job_id)
        if not service_job:
            raise ValueError(f"Service job {job_id} not found")
        
        service_job.enriched_technical_plan = enriched_plan.model_dump()
        service_job.status = ServiceJobStatus.completed
        service_job.processing_stage = ProcessingStage.completed
        
        self.session.add(service_job)
        await self.session.commit()
        await self.session.refresh(service_job)
        
        event_data = MiaStageEvent(
            stage=ProcessingStage.completed.value,
            stage_label=ProcessingStage.completed.label,
            progress=ProcessingStage.completed.progress,
            error=None,
        )
        await self.sse_manager.publish(
            event_id=job_id,
            data=event_data.model_dump(),
            event_type="completed",
        )
        
        return service_job
    
    async def update_additional_notes(
        self,
        job_id: str,
        additional_notes: str,
    ) -> ServiceJob:
        max_length = MIA_ADDITIONAL_NOTES_MAX_LENGTH
        if len(additional_notes) > max_length:
            raise ValueError(
                f"Additional notes exceed maximum length of {max_length} characters"
            )
                
        service_job = await self.get_service_job_by_id(job_id)
        if not service_job:
            raise ValueError(f"Service job {job_id} not found")
        
        service_job.additional_notes = additional_notes.strip()
        
        self.session.add(service_job)
        await self.session.commit()
        await self.session.refresh(service_job)
        
        return service_job
    
    async def validate_service_job(self, job_id: str) -> ServiceJob:
        service_job = await self.get_service_job_by_id(job_id)
        if not service_job:
            raise ValueError(f"Service job {job_id} not found")
        
        if service_job.status == ServiceJobStatus.validated:
            raise ValueError(f"Service job {job_id} is already validated")
        
        if service_job.status != ServiceJobStatus.completed:
            raise ValueError(
                f"Cannot validate job {job_id} with status {service_job.status}. "
                "Job must be completed first."
            )
            
        service_job.status = ServiceJobStatus.validated
        service_job.validated_at = datetime.utcnow()
    
        self.session.add(service_job)
        await self.session.commit()
        await self.session.refresh(service_job)
        
        return service_job
    
    async def mark_failed(
        self,
        job_id: str,
        error_details: str,
    ) -> ServiceJob:
        service_job = await self.get_service_job_by_id(job_id)
        if not service_job:
            raise ValueError(f"Service job {job_id} not found")
        
        service_job.status = ServiceJobStatus.failed
        service_job.processing_stage = ProcessingStage.failed
        service_job.error_details = error_details
        
        self.session.add(service_job)
        await self.session.commit()
        await self.session.refresh(service_job)
        
        event_data = MiaStageEvent(
            stage=ProcessingStage.failed.value,
            stage_label=ProcessingStage.failed.label,
            progress=0,
            error=error_details,
        )
        await self.sse_manager.publish(
            event_id=job_id,
            data=event_data.model_dump(),
            event_type="error",
        )
        
        return service_job


def get_mia_service(
    db: AsyncSession = Depends(get_session),
    sse_manager: SSEManager = Depends(get_sse_manager),
) -> MiaService:
    return MiaService(session=db, sse_manager=sse_manager)


async def run_mia_workflow_background(job_id: str) -> None:
    async with AsyncSession(async_engine) as session:
        workflow = create_mia_workflow_with_session(session)
        service = MiaService(session=session, sse_manager=global_sse_manager)
        await service.run_workflow(job_id, workflow)