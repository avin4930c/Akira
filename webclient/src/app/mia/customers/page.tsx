"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useMiaStore } from "@/stores/mia-data-store";
import EmptyState from "@/components/mia/common/EmptyState";
import { TableSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { useRouter } from "next/navigation";
import { CustomersHeader } from "@/components/mia/customers/CustomersHeader";
import { CustomersSearchBar } from "@/components/mia/customers/CustomersSearchBar";
import { CustomersTable } from "@/components/mia/customers/CustomersTable";
import { AddCustomerDialog } from "@/components/mia/customers/AddCustomerDialog";

export default function CustomersPage() {
  const router = useRouter();
  const { customers, getVehiclesByCustomer } = useMiaStore();
  const [search, setSearch] = useState("");
  const [isLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 rounded shimmer" />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <>
        <AddCustomerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start managing their vehicles and service jobs."
          actionLabel="Add Customer"
          onAction={() => setIsAddDialogOpen(true)}
        />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <CustomersHeader onAddClick={() => setIsAddDialogOpen(true)} />
      <AddCustomerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <CustomersSearchBar value={search} onChange={setSearch} />

      <CustomersTable
        customers={filteredCustomers}
        getVehiclesByCustomer={getVehiclesByCustomer}
        onViewVehicles={(customerId) => router.push(`/mia/vehicles?customer=${customerId}`)}
      />
    </motion.div>
  );
}
