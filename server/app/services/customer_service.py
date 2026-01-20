from fastapi import Depends
from app.core.database import get_session
from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional, List
from app.model.sql_models.mia import Customer, Vehicle, ServiceJob
from app.core.errors import ConflictError
from app.constants.common import MAX_SEARCH_RESULTS

class CustomerService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_customer(self, id: str, name: str, phone: str, email: str) -> Customer:
        if await self.get_customer(id):
            raise ConflictError(f"Customer with id '{id}' already exists")

        result = await self.session.exec(select(Customer).where(Customer.email == email))
        existing_by_email = result.first()
        if existing_by_email:
            raise ConflictError(f"Email '{email}' is already registered to another customer")

        customer = Customer(id=id, name=name, phone=phone, email=email)
        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer
        
    async def get_customer(self, customer_id: str) -> Optional[Customer]:
        statement = select(Customer).where(Customer.id == customer_id)
        result = await self.session.exec(statement)
        return result.first()
    
    async def list_customers(self) -> List[Customer]:
        statement = select(Customer)
        result = await self.session.exec(statement)
        return list(result.all())

    async def search_customers(self, q: str) -> List[Customer]:
        q = (q or "").strip()
        if not q:
            return []
        search_pattern = f"%{q}%"
        statement = select(Customer).where(
            (Customer.id.ilike(search_pattern)) |
            (Customer.name.ilike(search_pattern)) |
            (Customer.email.ilike(search_pattern))
        ).limit(MAX_SEARCH_RESULTS)
        result = await self.session.exec(statement)
        return list(result.all())
    
    async def update_customer(
        self,
        customer_id: str,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
        vehicle_count: Optional[int] = None,
    ) -> Optional[Customer]:
        customer = await self.get_customer(customer_id)
        if not customer:
            return None

        updates: dict = {}
        if name is not None:
            updates["name"] = name
        if phone is not None:
            updates["phone"] = phone
        if email is not None:
            # If email is changing, ensure uniqueness
            if email != customer.email:
                result = await self.session.exec(select(Customer).where(Customer.email == email))
                existing_by_email = result.first()
                if existing_by_email and existing_by_email.id != customer_id:
                    raise ConflictError(f"Email '{email}' is already registered to another customer")
            updates["email"] = email
        if vehicle_count is not None:
            updates["vehicle_count"] = vehicle_count

        for k, v in updates.items():
            setattr(customer, k, v)

        self.session.add(customer)
        await self.session.commit()
        await self.session.refresh(customer)
        return customer

    async def delete_customer(self, customer_id: str) -> bool:
        customer = await self.get_customer(customer_id)
        if not customer:
            return False
        await self.session.delete(customer)
        await self.session.commit()
        return True

    async def delete_customer_cascade(self, customer_id: str) -> bool:
        customer = await self.get_customer(customer_id)
        if not customer:
            return False

        try:
            await self.session.exec(delete(ServiceJob).where(ServiceJob.customer_id == customer_id))
            await self.session.exec(delete(Vehicle).where(Vehicle.customer_id == customer_id))
            await self.session.delete(customer)
            await self.session.commit()
            return True
        except Exception:
            await self.session.rollback()
            raise

    async def list_vehicles_for_customer(self, customer_id: str) -> List[Vehicle]:
        result = await self.session.exec(select(Vehicle).where(Vehicle.customer_id == customer_id))
        return list(result.all())

def get_customer_service(db: AsyncSession = Depends(get_session)) -> CustomerService:
    return CustomerService(session=db)