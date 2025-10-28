from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import uuid4
from app.constants.enums.mia_enums import ServiceJobStatus


class Customer(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    phone: str
    email: str
    vehicle_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Vehicle(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    customer_id: str = Field(foreign_key="customer.id", index=True)
    make: str
    model: str
    year: int
    registration: str
    mileage: int
    engine_type: str
    last_service_date: Optional[datetime] = None


class Mechanic(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    mechanic_code: str


class ServiceJob(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    customer_id: str = Field(foreign_key="customer.id", index=True)
    vehicle_id: str = Field(foreign_key="vehicle.id", index=True)
    mechanic_id: str = Field(foreign_key="mechanic.id", index=True)
    status: ServiceJobStatus = Field(default=ServiceJobStatus.pending)
    notes: str
    validated_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)