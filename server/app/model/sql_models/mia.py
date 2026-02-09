from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from typing import List
from typing import Optional
from datetime import datetime
from uuid import uuid4
from app.constants.enums.mia_enums import ServiceJobStatus, ProcessingStage
from app.constants.rag import EMBEDDING_DIMENSION


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


class PartAvailabilityStatus(str, Enum):
    available = "available"
    unavailable = "unavailable"
    partial = "partial"


class ServiceJob(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    customer_id: str = Field(foreign_key="customer.id", index=True)
    vehicle_id: str = Field(foreign_key="vehicle.id", index=True)
    mechanic_id: str = Field(foreign_key="mechanic.id", index=True)
    status: ServiceJobStatus = Field(
        default=ServiceJobStatus.pending,
        sa_column=Column(SAEnum(ServiceJobStatus, native_enum=False), nullable=False)
    )
    service_info: str = Field()
    mechanic_notes: str = Field()
    enriched_technical_plan: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    additional_notes: Optional[str] = Field(default=None)
    processing_stage: Optional[ProcessingStage] = Field(
        default=None,
        sa_column=Column(SAEnum(ProcessingStage, native_enum=False), nullable=True)
    )
    stage_updated_at: Optional[datetime] = Field(default=None)
    error_details: Optional[str] = Field(default=None)
    validated_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    customer: Optional["Customer"] = Relationship()
    vehicle: Optional["Vehicle"] = Relationship()
    mechanic: Optional["Mechanic"] = Relationship()


class PartInventory(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    part_code: str = Field(index=True, unique=True)
    name: str
    description: Optional[str] = None
    stock_quantity: int = Field(default=0, ge=0)
    unit_price: float = Field(ge=0)
    compatible_models: List[str] = Field(default_factory=list, sa_type=JSONB)
    embedding: Optional[List[float]] = Field(
        default=None,
        sa_column=Column(Vector(EMBEDDING_DIMENSION)),
    )