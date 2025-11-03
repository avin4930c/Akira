import { useQueryClient } from "@tanstack/react-query";
import { customerKeys } from "./customer-keys";

export function useCustomerInvalidation() {
    const queryClient = useQueryClient();

    const invalidateCustomers = () => {
        queryClient.invalidateQueries({ queryKey: customerKeys.all });
    };

    const invalidateCustomerById = (customerId: string) => {
        queryClient.invalidateQueries({ queryKey: customerKeys.customer(customerId) });
    };

    return { invalidateCustomers, invalidateCustomerById };
}