import { create } from "zustand";
import { Customer, Vehicle, ServiceJob, Mechanic, ServiceJobStatus } from "@/types/mia";

interface MiaDataStore {
  // State
  customers: Customer[];
  vehicles: Vehicle[];
  serviceJobs: ServiceJob[];
  mechanics: Mechanic[];

  // Actions
  addCustomer: (customer: Omit<Customer, "id" | "created_at">) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  addServiceJob: (job: Omit<ServiceJob, "id" | "created_at">) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByCustomer: (customerId: string) => Vehicle[];
  getMechanicById: (id: string) => Mechanic | undefined;
}

// Initial mock data for development
const initialCustomers: Customer[] = [
  {
    id: "USR-001",
    name: "John Rider",
    phone: "+1 234 567 8900",
    email: "john@example.com",
    created_at: "2024-01-15",
  },
  {
    id: "USR-002",
    name: "Sarah Biker",
    phone: "+1 234 567 8901",
    email: "sarah@example.com",
    created_at: "2024-02-20",
  },
];

const initialVehicles: Vehicle[] = [
  {
    id: "1",
    customer_id: "USR-001",
    make: "Yamaha",
    model: "MT-07",
    year: 2022,
    registration: "ABC-1234",
    mileage: 12500,
    engine_type: "689cc Parallel Twin",
    last_service_date: "2024-01-15",
  },
  {
    id: "2",
    customer_id: "USR-001",
    make: "Honda",
    model: "CBR650R",
    year: 2023,
    registration: "XYZ-5678",
    mileage: 8200,
    engine_type: "649cc Inline-4",
    last_service_date: "2024-02-20",
  },
  {
    id: "3",
    customer_id: "USR-002",
    make: "Kawasaki",
    model: "Ninja 400",
    year: 2021,
    registration: "DEF-9012",
    mileage: 15300,
    engine_type: "399cc Parallel Twin",
    last_service_date: "2024-03-10",
  },
];

const initialMechanics: Mechanic[] = [
  { id: "1", user_id: "USR-M001", name: "Mike Smith", mechanic_code: "MCH-001" },
  { id: "2", user_id: "USR-M002", name: "Tom Johnson", mechanic_code: "MCH-002" },
  { id: "3", user_id: "USR-M003", name: "Anna Williams", mechanic_code: "MCH-003" },
];

const initialServiceJobs: ServiceJob[] = [
  {
    id: "1",
    customer_id: "USR-001",
    vehicle_id: "1",
    mechanic_id: "1",
    status: ServiceJobStatus.Validated,
    notes: "Oil change and brake inspection completed",
    validated_at: "2024-01-15",
    created_at: "2024-01-15",
  },
];

export const useMiaStore = create<MiaDataStore>((set, get) => ({
  // Initial state
  customers: initialCustomers,
  vehicles: initialVehicles,
  serviceJobs: initialServiceJobs,
  mechanics: initialMechanics,

  // Actions
  addCustomer: (customer) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }));
  },

  addVehicle: (vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
    };
    set((state) => ({
      vehicles: [...state.vehicles, newVehicle],
    }));
  },

  addServiceJob: (job) => {
    const newJob: ServiceJob = {
      ...job,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      serviceJobs: [...state.serviceJobs, newJob],
    }));
  },

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  },

  getVehicleById: (id) => {
    return get().vehicles.find((v) => v.id === id);
  },

  getVehiclesByCustomer: (customerId) => {
    return get().vehicles.filter((v) => v.customer_id === customerId);
  },

  getMechanicById: (id) => {
    return get().mechanics.find((m) => m.id === id);
  },
}));
