import { api } from "@/services/api/client";
import { Customer } from "@/types/mia";

export async function addCustomer(data: Customer): Promise<Customer> {
    try {
        const response = await api.post<Customer, Customer>("/customer", data);
        return response;
    } catch (error) {
        console.error("Error adding new customer:", error);
        throw error;
    }
}

export async function getCustomers(): Promise<Customer[]> {
    try {
        const response = await api.get<Customer[]>("/customer");
        return response;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
}

export async function getCustomerById(customerId: string): Promise<Customer> {
    try {
        const response = await api.get<Customer>(`/customer/${customerId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching customer with ID ${customerId}:`, error);
        throw error;
    }
}

export async function getCustomerSearchSuggestions(query: string): Promise<Customer[]> {
    try {
        const response = await api.post<Customer[], { query: string }>(`/customer/search`, { query });
        return response;
    } catch (error) {
        console.error("Error fetching customer search suggestions:", error);
        throw error;
    }
}

export async function deleteCustomer(customerId: string): Promise<void> {
    try {
        await api.delete<void>(`/customer/${customerId}`);
    } catch (error) {
        console.error(`Error deleting customer with ID ${customerId}:`, error);
        throw error;
    }
}