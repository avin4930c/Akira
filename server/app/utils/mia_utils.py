from app.model.sql_models.mia import ServiceJob
from app.model.response.service_job import ServiceJobResponse
from app.model.response.mia import EnrichedTechnicalPlan


def service_job_to_response(service_job: ServiceJob) -> ServiceJobResponse:
    """Convert ServiceJob SQL model to ServiceJobResponse."""
    enriched_plan = None
    if service_job.enriched_technical_plan:
        enriched_plan = EnrichedTechnicalPlan.model_validate(
            service_job.enriched_technical_plan
        )
    
    return ServiceJobResponse(
        id=service_job.id,
        customer_id=service_job.customer_id,
        vehicle_id=service_job.vehicle_id,
        mechanic_id=service_job.mechanic_id,
        status=service_job.status,
        service_info=service_job.service_info,
        mechanic_notes=service_job.mechanic_notes,
        enriched_technical_plan=enriched_plan,
        additional_notes=service_job.additional_notes,
        processing_stage=service_job.processing_stage,
        stage_updated_at=service_job.stage_updated_at,
        error_details=service_job.error_details,
        validated_at=service_job.validated_at,
        created_at=service_job.created_at,
    )