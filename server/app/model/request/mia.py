from pydantic import BaseModel
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
    validated_at: Optional[datetime]
    created_at: datetime = datetime.utcnow()