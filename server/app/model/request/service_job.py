from pydantic import BaseModel, field_validator
from typing import Optional
from app.constants.enums.mia_enums import ServiceJobStatus
from datetime import datetime


class ServiceJobRequest(BaseModel):
    id: str
    customer_id: str
    vehicle_id: str
    mechanic_id: str
    status: ServiceJobStatus = ServiceJobStatus.pending
    service_info: str
    mechanic_notes: str
    validated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    @field_validator("created_at", mode="before")
    @classmethod
    def set_created_at(cls, v):
        """Default to current time if created_at is None or not provided."""
        return v or datetime.utcnow()