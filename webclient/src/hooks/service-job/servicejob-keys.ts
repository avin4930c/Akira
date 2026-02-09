export const serviceJobKeys = {
  all: ["service-jobs"] as const,
  lists: () => [...serviceJobKeys.all, "list"] as const,
  list: (vehicleId?: string) => [...serviceJobKeys.lists(), vehicleId] as const,
  details: () => [...serviceJobKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceJobKeys.details(), id] as const,
};