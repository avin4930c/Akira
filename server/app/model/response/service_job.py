from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.constants.enums.mia_enums import ServiceJobStatus, ProcessingStage
from app.model.response.mia import EnrichedTechnicalPlan
from app.model.response.vehicle import VehicleResponse
from app.model.response.customer import CustomerResponse


class ServiceJobListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    customer_id: str
    customer: Optional[CustomerResponse] = None
    vehicle_id: str
    vehicle: Optional[VehicleResponse] = None
    mechanic_id: str
    status: ServiceJobStatus
    service_info: str
    mechanic_notes: str
    additional_notes: Optional[str] = None
    processing_stage: Optional[ProcessingStage] = None
    stage_updated_at: Optional[datetime] = None
    error_details: Optional[str] = None
    validated_at: Optional[datetime] = None
    created_at: datetime


class ServiceJobResponse(ServiceJobListResponse):
    enriched_technical_plan: Optional[EnrichedTechnicalPlan] = None