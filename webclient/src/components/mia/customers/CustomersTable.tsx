import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer, Vehicle } from "@/types/mia";

interface CustomersTableProps {
    customers: Customer[];
    getVehiclesByCustomer: (customerId: string) => Vehicle[];
    onViewVehicles: (customerId: string) => void;
}

export function CustomersTable({ customers, getVehiclesByCustomer, onViewVehicles }: CustomersTableProps) {
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
                                    <span className="text-xs font-mono text-muted-foreground">{customer.id}</span>
                                </td>
                                <td className="px-6 py-4 font-medium">{customer.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{customer.phone}</td>
                                <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                        {getVehiclesByCustomer(customer.id).length}
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
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}