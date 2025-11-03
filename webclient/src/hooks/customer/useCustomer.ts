import { addCustomer, deleteCustomer, getCustomerById, getCustomers, getCustomerSearchSuggestions } from "@/actions/customer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customerKeys } from "./customer-keys";
import { Customer } from "@/types/mia";
import { useCustomerInvalidation } from "./useCustomerInvalidation";

export function useCustomerById(customerId: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: customerKeys.customer(customerId),
        queryFn: () => getCustomerById(customerId),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!customerId,
    });

    return { data, error, isLoading };
}

export function useCustomers() {
    const { data, error, isLoading } = useQuery({
        queryKey: customerKeys.all,
        queryFn: () => getCustomers(),
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return { data, error, isLoading };
}

export function useCustomerSearchSuggestions(query: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: customerKeys.searchSuggestion(query),
        queryFn: () => getCustomerSearchSuggestions(query),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: query.length > 0,
    });

    return { data, error, isLoading };
}

export const useAddCustomerMutation = () => {
    const { invalidateCustomers } = useCustomerInvalidation();

    return useMutation({
        mutationFn: (data: Customer) => addCustomer(data),
        onSuccess: (data) => {
            invalidateCustomers();
            return data;
        },
        onError: (error) => {
            console.error("Error adding new customer:", error);
        }
    });
}

export const useDeleteCustomerMutation = () => {
    const { invalidateCustomers } = useCustomerInvalidation();

    return useMutation({
        mutationFn: (customerId: string) => deleteCustomer(customerId),
        onSuccess: () => {
            invalidateCustomers();
        },
        onError: (error) => {
            console.error("Error deleting customer:", error);
        }
    });
}