import { useQueryClient } from "@tanstack/react-query";
import { serviceJobKeys } from "./servicejob-keys";

export function useServiceJobInvalidation() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: serviceJobKeys.all }),
    invalidateJob: (id: string) =>
      queryClient.invalidateQueries({ queryKey: serviceJobKeys.detail(id) }),
    invalidateLists: () => queryClient.invalidateQueries({ queryKey: serviceJobKeys.lists() }),
    refetchJob: (id: string) =>
      queryClient.refetchQueries({ queryKey: serviceJobKeys.detail(id) }),
  };
}