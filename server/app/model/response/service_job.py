from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.constants.enums.mia_enums import ServiceJobStatus, ProcessingStage
from app.model.response.mia import EnrichedTechnicalPlan


class ServiceJobResponse(BaseModel):
    id: str
    customer_id: str
    vehicle_id: str
    mechanic_id: str
    status: ServiceJobStatus
    service_info: str
    mechanic_notes: str
    enriched_technical_plan: Optional[EnrichedTechnicalPlan] = None
    additional_notes: Optional[str] = None
    processing_stage: Optional[ProcessingStage] = None
    stage_updated_at: Optional[datetime] = None
    error_details: Optional[str] = None
    validated_at: Optional[datetime] = None
    created_at: datetime