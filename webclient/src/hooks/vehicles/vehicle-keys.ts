export const vehicleKeys = {
    all: ["vehicles"] as const,
    vehiclesByCustomerId: (customerId: string) => [...vehicleKeys.all, "byCustomerId", customerId] as const,
    vehicle: (vehicleId: string) => [...vehicleKeys.all, "vehicle", vehicleId] as const,
};