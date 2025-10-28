export enum ServiceJobStatus { 
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
  Validated = "validated",
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_count?: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string; //TODO: Restrict to known makes
  model: string;
  year: number;
  registration: string;
  mileage: number;
  engine_type: string;
  last_service_date: string;
}

export interface Mechanic {
  id: string;
  name: string;
  mechanic_code: string;
}

export interface ServiceJob {
  id: string;
  customer_id: string;
  vehicle_id: string;
  mechanic_id: string;
  status: ServiceJobStatus;
  notes: string;
  validated_at?: string;
  created_at: string;
}