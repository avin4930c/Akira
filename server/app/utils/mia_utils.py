from app.model.sql_models.mia import ServiceJob
from app.model.response.service_job import ServiceJobResponse, ServiceJobListResponse
from app.model.response.mia import EnrichedTechnicalPlan
from app.model.response.customer import CustomerResponse
from app.model.response.vehicle import VehicleResponse


def service_job_to_list_response(job: ServiceJob) -> ServiceJobListResponse:
    return ServiceJobListResponse(
        id=job.id,
        customer_id=job.customer_id,
        customer=CustomerResponse.model_validate(job.customer) if job.customer else None,
        vehicle_id=job.vehicle_id,
        vehicle=VehicleResponse.model_validate(job.vehicle) if job.vehicle else None,
        mechanic_id=job.mechanic_id,
        status=job.status,
        service_info=job.service_info,
        mechanic_notes=job.mechanic_notes,
        additional_notes=job.additional_notes,
        processing_stage=job.processing_stage,
        stage_updated_at=job.stage_updated_at,
        error_details=job.error_details,
        validated_at=job.validated_at,
        created_at=job.created_at,
    )


def service_job_to_response(service_job: ServiceJob) -> ServiceJobResponse:
    enriched_plan = None
    if service_job.enriched_technical_plan:
        enriched_plan = EnrichedTechnicalPlan.model_validate(service_job.enriched_technical_plan)
    
    customer = CustomerResponse.model_validate(service_job.customer) if service_job.customer else None
    vehicle = VehicleResponse.model_validate(service_job.vehicle) if service_job.vehicle else None
    
    return ServiceJobResponse(
        id=service_job.id,
        customer_id=service_job.customer_id,
        customer=customer,
        vehicle_id=service_job.vehicle_id,
        vehicle=vehicle,
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