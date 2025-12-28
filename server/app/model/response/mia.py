from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.constants.enums.mia_enums import ServiceJobStatus


class ServiceJobResponse(BaseModel):
    id: str
    customer_id: str
    vehicle_id: str
    mechanic_id: str
    status: ServiceJobStatus
    service_info: str
    mechanic_notes: str
    validated_at: Optional[datetime] = None
    created_at: datetime