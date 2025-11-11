import { useMutation, useQuery } from "@tanstack/react-query";
import { vehicleKeys } from "./vehicle-keys";
import { addVehicle, deleteVehicle, getVehicleById, getVehiclesByCustomerId, updateVehicle } from "@/actions/vehicle";
import type { UpdateVehicleInput } from "@/schema/vehicle";
import { useVehicleInvalidation } from "./useVehicleInvalidation";
import { CreateVehicleInput } from "@/schema/vehicle";
import { useCustomerInvalidation } from "../customer/useCustomerInvalidation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useVehiclesByCustomerId(customerId: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: vehicleKeys.vehiclesByCustomerId(customerId),
        queryFn: () => getVehiclesByCustomerId(customerId),
    });

    return { data, error, isLoading };
}

export function useVehicleById(vehicleId: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: vehicleKeys.vehicle(vehicleId),
        queryFn: () => getVehicleById(vehicleId),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!vehicleId,
    });

    return { data, error, isLoading };
}

export const useAddVehicleMutation = () => {
    const { invalidateVehiclesByCustomerId } = useVehicleInvalidation();
    const { invalidateCustomers, invalidateCustomerById } = useCustomerInvalidation();

    return useMutation({
        mutationFn: (data: CreateVehicleInput) => addVehicle(data),
        onSuccess: (data) => {
            invalidateVehiclesByCustomerId(data.customer_id);
            invalidateCustomerById(data.customer_id);
            invalidateCustomers()
            return data;
        },
        onError: (error) => {
            console.error("Error adding new vehicle:", error);
        }
    });
}

export const useUpdateVehicleMutation = () => {
    const { invalidateById } = useVehicleInvalidation();

    return useMutation({
        mutationFn: ({ vehicleId, data }: { vehicleId: string; data: UpdateVehicleInput }) => updateVehicle(vehicleId, data),
        onSuccess: (data) => {
            invalidateById(data.id);
            return data;
        },
        onError: (error) => {
            console.error("Error updating vehicle:", error);
        }
    });
}

export const useDeleteVehicleMutation = (customerId: string, router: AppRouterInstance) => {
    const { invalidateVehiclesByCustomerId } = useVehicleInvalidation();
    const { invalidateCustomers } = useCustomerInvalidation();

    return useMutation({
        mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
        onSuccess: () => {
            invalidateVehiclesByCustomerId(customerId);
            invalidateCustomers();
            router.push(`/mia/vehicles?customer=${customerId}`);
        },
        onError: (error) => {
            console.error("Error deleting vehicle:", error);
        }
    });
}
