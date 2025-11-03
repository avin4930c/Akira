import { useQueryClient } from "@tanstack/react-query";
import { vehicleKeys } from "./vehicle-keys";

export function useVehicleInvalidation() {
    const queryClient = useQueryClient();

    const invalidateVehicles = () => {
        queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    };

    const invalidateById = (vehicleId: string) => {
        queryClient.invalidateQueries({ queryKey: vehicleKeys.vehicle(vehicleId) });
    };

    const invalidateVehiclesByCustomerId = (customerId: string) => {
        queryClient.invalidateQueries({ queryKey: vehicleKeys.vehiclesByCustomerId(customerId) });
    };

    return { invalidateVehicles, invalidateById, invalidateVehiclesByCustomerId };
}