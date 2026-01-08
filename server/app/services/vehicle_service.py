from fastapi import Depends
from app.core.database import get_session
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional, List
from datetime import datetime
from app.model.sql_models.mia import Vehicle, Customer
from app.core.errors import ConflictError, ValidationError

class VehicleService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_vehicle(self, customer_id: str, make: str, model: str, year: int, registration: str, mileage: int, engine_type: str, last_service_date: Optional[datetime] = None) -> Vehicle:
        registration = registration.strip().upper()
        result = await self.session.exec(select(Customer).where(Customer.id == customer_id))
        customer: Customer = result.first()
        if not customer:
            raise ValidationError(f"Customer '{customer_id}' not found")

        # Ensure registration is unique
        result = await self.session.exec(select(Vehicle).where(Vehicle.registration == registration))
        existing_reg = result.first()
        if existing_reg:
            raise ConflictError(f"Registration '{registration}' is already registered to another vehicle")

        vehicle = Vehicle(customer_id=customer_id, make=make, model=model, year=year, registration=registration, mileage=mileage, engine_type=engine_type, last_service_date=last_service_date)
        self.session.add(vehicle)

        customer.vehicle_count = (customer.vehicle_count or 0) + 1
        self.session.add(customer)
        
        await self.session.commit()
        await self.session.refresh(vehicle)
        return vehicle

    async def get_vehicle(self, vehicle_id: str) -> Optional[Vehicle]:
        statement = select(Vehicle).where(Vehicle.id == vehicle_id)
        result = await self.session.exec(statement)
        return result.first()

    async def list_vehicles(self, customer_id: str) -> List[Vehicle]:
        statement = select(Vehicle).where(Vehicle.customer_id == customer_id)
        result = await self.session.exec(statement)
        return list(result.all())

    """TODO: Check if fields can be set to required and adapt in frontend"""
    async def update_vehicle(
        self,
        vehicle_id: str,
        make: Optional[str] = None,
        model: Optional[str] = None,
        year: Optional[int] = None,
        registration: Optional[str] = None,
        mileage: Optional[int] = None,
        engine_type: Optional[str] = None,
        last_service_date: Optional[datetime] = None,
    ) -> Optional[Vehicle]:
        vehicle = await self.get_vehicle(vehicle_id)
        if not vehicle:
            return None

        updates: dict = {}
        if make is not None:
            updates["make"] = make
        if model is not None:
            updates["model"] = model
        if year is not None:
            updates["year"] = year
        if registration is not None:
            normalized_reg = registration.strip().upper()
            if normalized_reg != (vehicle.registration or "").upper():
                result = await self.session.exec(select(Vehicle).where(Vehicle.registration == normalized_reg))
                existing_reg = result.first()
                if existing_reg and existing_reg.id != vehicle_id:
                    raise ConflictError(f"Registration '{normalized_reg}' is already registered to another vehicle")
            updates["registration"] = normalized_reg
        if mileage is not None:
            updates["mileage"] = mileage
        if engine_type is not None:
            updates["engine_type"] = engine_type
        if last_service_date is not None:
            updates["last_service_date"] = last_service_date

        for k, v in updates.items():
            setattr(vehicle, k, v)

        self.session.add(vehicle)
        await self.session.commit()
        await self.session.refresh(vehicle)

        return vehicle

    async def delete_vehicle(self, vehicle_id: str) -> bool:
        vehicle = await self.get_vehicle(vehicle_id)
        if not vehicle:
            return False
        result = await self.session.exec(select(Customer).where(Customer.id == vehicle.customer_id))
        customer = result.first()
        self.session.delete(vehicle)
        if customer:
            customer.vehicle_count = max(0, (customer.vehicle_count or 0) - 1)
            self.session.add(customer)
        await self.session.commit()
        return True

    async def delete_vehicles_for_customer(self, customer_id: str) -> int:
        vehicles = await self.list_vehicles(customer_id)
        deleted = 0
        for v in vehicles:
            self.session.delete(v)
            deleted += 1
        result = await self.session.exec(select(Customer).where(Customer.id == customer_id))
        customer = result.first()
        if customer:
            customer.vehicle_count = 0
            self.session.add(customer)
        await self.session.commit()
        return deleted

def get_vehicle_service(db: AsyncSession = Depends(get_session)) -> VehicleService:
    return VehicleService(session=db)