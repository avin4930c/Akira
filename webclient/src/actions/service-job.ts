import { api } from "@/services/api/client";
import type { ServiceJob, ServiceJobList, CreateServiceJobRequest, UpdateNotesRequest, Mechanic } from "@/types/mia";

export type { CreateServiceJobRequest, UpdateNotesRequest } from "@/types/mia";

export async function createServiceJob(data: CreateServiceJobRequest): Promise<ServiceJob> {
  const response = await api.post<ServiceJob, CreateServiceJobRequest>("/mia/service-jobs/", data);
  return response;
}

export async function getServiceJobs(vehicleId?: string): Promise<ServiceJobList[]> {
  const params = vehicleId ? `?vehicle_id=${vehicleId}` : "";
  const response = await api.get<ServiceJobList[]>(`/mia/service-jobs/${params}`);
  return response;
}

export async function getServiceJobById(serviceJobId: string): Promise<ServiceJob> {
  const response = await api.get<ServiceJob>(`/mia/service-jobs/${serviceJobId}`);
  return response;
}

export async function validateServiceJob(serviceJobId: string): Promise<ServiceJob> {
  const response = await api.patch<ServiceJob, object>(`/mia/service-jobs/${serviceJobId}/validate`, {});
  return response;
}

export async function updateServiceJobNotes(serviceJobId: string, notes: string): Promise<ServiceJob> {
  const response = await api.patch<ServiceJob, UpdateNotesRequest>(
    `/mia/service-jobs/${serviceJobId}/notes`,
    { additional_notes: notes }
  );
  return response;
}

export async function getMechanics(): Promise<Mechanic[]> {
    try {
        const response = await api.get<Mechanic[]>("/mechanic/");
        return response;
    } catch (error) {
        console.error("Error fetching mechanics:", error);
        throw error;
    }
}