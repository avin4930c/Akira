from fastapi import Depends
from app.core.database import get_session
from sqlmodel import Session, select
from typing import Optional, List
from app.model.sql_models.mia import Customer, Vehicle
from app.core.errors import ConflictError
from app.constants.common import MAX_SEARCH_RESULTS

class CustomerService:
    def __init__(self, session: Session):
        self.session = session

    async def add_customer(self, id: str, name: str, phone: str, email: str) -> Customer:
        if await self.get_customer(id):
            raise ConflictError(f"Customer with id '{id}' already exists")

        existing_by_email = self.session.exec(select(Customer).where(Customer.email == email)).first()
        if existing_by_email:
            raise ConflictError(f"Email '{email}' is already registered to another customer")

        customer = Customer(id=id, name=name, phone=phone, email=email)
        self.session.add(customer)
        self.session.commit()
        self.session.refresh(customer)
        return customer
        
    async def get_customer(self, customer_id: str) -> Optional[Customer]:
        statement = select(Customer).where(Customer.id == customer_id)
        return self.session.exec(statement).first()
    
    async def list_customers(self) -> List[Customer]:
        statement = select(Customer)
        return list(self.session.exec(statement).all())

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
        return list(self.session.exec(statement).all())
    
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
                existing_by_email = self.session.exec(select(Customer).where(Customer.email == email)).first()
                if existing_by_email and existing_by_email.id != customer_id:
                    raise ConflictError(f"Email '{email}' is already registered to another customer")
            updates["email"] = email
        if vehicle_count is not None:
            updates["vehicle_count"] = vehicle_count

        for k, v in updates.items():
            setattr(customer, k, v)

        self.session.add(customer)
        self.session.commit()
        self.session.refresh(customer)
        return customer

    async def delete_customer(self, customer_id: str) -> bool:
        customer = await self.get_customer(customer_id)
        if not customer:
            return False
        self.session.delete(customer)
        self.session.commit()
        return True

    async def delete_customer_cascade(self, customer_id: str) -> bool:
        customer = await self.get_customer(customer_id)
        if not customer:
            return False

        try:
            vehicles = list(self.session.exec(select(Vehicle).where(Vehicle.customer_id == customer_id)).all())
            for v in vehicles:
                self.session.delete(v)
            self.session.delete(customer)
            self.session.commit()
            return True
        except Exception:
            self.session.rollback()
            raise

    async def list_vehicles_for_customer(self, customer_id: str) -> List[Vehicle]:
        return list(self.session.exec(select(Vehicle).where(Vehicle.customer_id == customer_id)).all())

def get_customer_service(db: Session = Depends(get_session)) -> CustomerService:
    return CustomerService(session=db)