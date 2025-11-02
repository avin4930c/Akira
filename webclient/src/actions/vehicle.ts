import { api } from "@/services/api/client";
import { Vehicle } from "@/types/mia";
import type { CreateVehicleInput, UpdateVehicleInput } from "@/schema/vehicle";

export async function addVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    try {
        const response = await api.post<Vehicle, CreateVehicleInput>("/vehicle", data);
        return response;
    } catch (error) {
        console.error("Error creating new vehicle:", error);
        throw error;
    }
}

export async function getVehiclesByCustomerId(customerId: string): Promise<Vehicle[]> {
    try {
        const response = await api.get<Vehicle[]>(`/vehicle?customer_id=${customerId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching vehicles for customer ${customerId}:`, error);
        throw error;
    }
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle> {
    try {
        const response = await api.get<Vehicle>(`/vehicle/${vehicleId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching vehicle with ID ${vehicleId}:`, error);
        throw error;
    }
}

export async function updateVehicle(vehicleId: string, data: UpdateVehicleInput): Promise<Vehicle> {
    try {
        const response = await api.put<Vehicle, UpdateVehicleInput>(`/vehicle/${vehicleId}`, data);
        return response;
    } catch (error) {
        console.error(`Error updating vehicle with ID ${vehicleId}:`, error);
        throw error;
    }
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
    try {
        await api.delete<void>(`/vehicle/${vehicleId}`);
    } catch (error) {
        console.error(`Error deleting vehicle with ID ${vehicleId}:`, error);
        throw error;
    }
}