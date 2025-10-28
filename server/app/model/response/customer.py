from pydantic import BaseModel
from datetime import datetime

class GetCustomerResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    vehicle_count: int
    created_at: datetime