import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceJobKeys } from "./servicejob-keys";
import {
  createServiceJob,
  getServiceJobById,
  getServiceJobs,
  validateServiceJob,
  updateServiceJobNotes,
} from "@/actions/service-job";
import type { ServiceJob, CreateServiceJobRequest } from "@/types/mia";

interface UseCreateServiceJobOptions {
  onSuccess?: (data: ServiceJob) => void;
  onError?: (error: Error) => void;
}

interface UseValidateServiceJobOptions {
  onSuccess?: (data: ServiceJob) => void;
  onError?: (error: Error) => void;
}

interface UseUpdateNotesOptions {
  onSuccess?: (data: ServiceJob) => void;
  onError?: (error: Error) => void;
}

export function useServiceJobs(vehicleId?: string) {
  return useQuery({
    queryKey: serviceJobKeys.list(vehicleId),
    queryFn: () => getServiceJobs(vehicleId),
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useServiceJobById(id: string) {
  return useQuery({
    queryKey: serviceJobKeys.detail(id),
    queryFn: () => getServiceJobById(id),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
  });
}

export function useCreateServiceJob(options: UseCreateServiceJobOptions = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceJobRequest) => createServiceJob(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceJobKeys.all });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useValidateServiceJob(options: UseValidateServiceJobOptions = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => validateServiceJob(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(serviceJobKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: serviceJobKeys.all });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

export function useUpdateServiceJobNotes(options: UseUpdateNotesOptions = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateServiceJobNotes(id, notes),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(serviceJobKeys.detail(id), data);
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}