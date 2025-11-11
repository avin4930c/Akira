import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/mia";
import { useState } from "react";
import { useDeleteCustomerMutation } from "@/hooks/customer/useCustomer";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { HighlightedText } from "@/components/common/HighlightedText";

interface CustomersTableProps {
    customers: Customer[];
    onViewVehicles: (customerId: string) => void;
    searchQuery?: string;
}

export function CustomersTable({ customers, onViewVehicles, searchQuery = "" }: CustomersTableProps) {
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const deleteCustomerMutation = useDeleteCustomerMutation();

    async function handleDeleteCustomer() {
        if (!confirmId) return;
        try {
            await deleteCustomerMutation.mutateAsync(confirmId);
            toast.success("Customer deleted");
        } catch (error) {
            toast.error("Failed to delete customer");
        }
    }

    return (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vehicles</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, idx) => (
                            <motion.tr
                                key={customer.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {searchQuery ? (
                                            <HighlightedText text={customer.id} query={searchQuery} />
                                        ) : (
                                            customer.id
                                        )}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {searchQuery ? (
                                        <HighlightedText text={customer.name} query={searchQuery} />
                                    ) : (
                                        customer.name
                                    )}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{customer.phone}</td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {searchQuery ? (
                                        <HighlightedText text={customer.email} query={searchQuery} />
                                    ) : (
                                        customer.email
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                        {customer.vehicle_count}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewVehicles(customer.id)}
                                            className="border-primary/30 hover:bg-primary/10"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Vehicles
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setConfirmId(customer.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <ConfirmDeleteDialog
                open={!!confirmId}
                onOpenChange={(open) => { if (!open) setConfirmId(null); }}
                title="Delete Customer"
                description="This action cannot be undone. This will permanently delete the customer and their related data."
                loading={deleteCustomerMutation.isPending}
                onConfirm={handleDeleteCustomer}
            />
        </div>
    );
}