"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomers } from "@/hooks/customer/useCustomer";
import { useVehiclesByCustomerId } from "@/hooks/vehicles/useVehicles";
import { useMechanics } from "@/hooks/mechanic/useMechanic";
import { CardSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { NewServiceJobHeader } from "@/components/mia/service-jobs/form/NewServiceJobHeader";
import { SelectCustomerControl } from "@/components/mia/service-jobs/form/SelectCustomerControl";
import { SelectVehicleControl } from "@/components/mia/service-jobs/form/SelectVehicleControl";
import { SelectMechanicControl } from "@/components/mia/service-jobs/form/SelectMechanicControl";
import { ServiceInfoField } from "@/components/mia/service-jobs/form/ServiceInfoField";
import { NotesField } from "@/components/mia/service-jobs/form/NotesField";
import { FormActions } from "@/components/mia/service-jobs/form/FormActions";
import { useCreateServiceJob } from "@/hooks/service-job/useServiceJob";
import { v4 as uuidv4 } from "uuid";

function NewServiceJobContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [selectedMechanic, setSelectedMechanic] = useState("");
    const [serviceInfo, setServiceInfo] = useState("");
    const [notes, setNotes] = useState("");
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const customerFromUrl = searchParams?.get("customer");
        const vehicleFromUrl = searchParams?.get("vehicle");
        
        if (customerFromUrl) setSelectedCustomer(customerFromUrl);
        if (vehicleFromUrl) setSelectedVehicle(vehicleFromUrl);
    }, [searchParams]);

    const { data: allCustomers, isLoading: loadingCustomers } = useCustomers();
    const { data: customerVehicles, isLoading: loadingVehicles } = useVehiclesByCustomerId(selectedCustomer);
    const { data: allMechanics, isLoading: loadingMechanics } = useMechanics();

    const createMutation = useCreateServiceJob({
        onSuccess: (job) => {
            toast.success("Service job created! Redirecting to processing...");
            router.push(`/mia/service-jobs/${job.id}`);
        },
        onError: (error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });

    useEffect(() => {
        if (!searchParams.get("vehicle")) setSelectedVehicle("");
    }, [selectedCustomer, searchParams]);

    const customerOptions = (allCustomers || []).map((c) => ({
        value: c.id,
        label: c.name,
        subtitle: `${c.phone} • ${c.email}`,
    }));

    const vehicleOptions = selectedCustomer
        ? (customerVehicles || []).map((v) => ({
            value: v.id,
            label: `${v.make} ${v.model}`,
            subtitle: `${v.registration} • ${v.year}`,
        }))
        : [];

    const mechanicOptions = (allMechanics || []).map((m) => ({
        value: m.id,
        label: m.name,
        subtitle: m.mechanic_code,
    }));

    const validateForm = (): boolean => {
        const trimmedNotes = notes.trim();
        const trimmedServiceInfo = serviceInfo.trim();

        if (!selectedCustomer || !selectedVehicle || !selectedMechanic) {
            toast.error("Please fill all required fields");
            return false;
        }
        if (!trimmedServiceInfo || trimmedServiceInfo.length < 5) {
            setShowWarning(true);
            return false;
        }
        if (!trimmedNotes || trimmedNotes.length < 10) {
            setShowWarning(true);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        createMutation.mutate({
            id: uuidv4(),
            customer_id: selectedCustomer,
            vehicle_id: selectedVehicle,
            mechanic_id: selectedMechanic,
            service_info: serviceInfo.trim(),
            mechanic_notes: notes.trim(),
        });
    };

    const handleCancel = () => {
        router.push("/mia/service-jobs");
    };

    const isSubmitting = createMutation.isPending;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <NewServiceJobHeader />

            <div className="glass-card p-8 rounded-xl space-y-6">
                <SelectCustomerControl
                    options={customerOptions}
                    value={selectedCustomer}
                    onChange={(v) => { setSelectedCustomer(v); setShowWarning(false); }}
                    loading={loadingCustomers}
                    disabled={isSubmitting}
                />

                <SelectVehicleControl
                    options={vehicleOptions}
                    value={selectedVehicle}
                    onChange={(v) => { setSelectedVehicle(v); setShowWarning(false); }}
                    visible={!!selectedCustomer}
                    loading={loadingVehicles}
                    disabled={isSubmitting}
                />

                <SelectMechanicControl 
                    options={mechanicOptions} 
                    value={selectedMechanic} 
                    onChange={(v) => { setSelectedMechanic(v); setShowWarning(false); }} 
                    disabled={isSubmitting}
                    loading={loadingMechanics}
                />

                <ServiceInfoField 
                    value={serviceInfo} 
                    onChange={(v) => { setServiceInfo(v); setShowWarning(false); }} 
                    disabled={isSubmitting}
                />

                <NotesField 
                    value={notes} 
                    onChange={(v) => { setNotes(v); setShowWarning(false); }} 
                    disabled={isSubmitting}
                />

                {showWarning && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert className="border-yellow-500/50 bg-yellow-500/10">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-500">
                                Missing data detected. Please provide service information and detailed symptoms/diagnosis before submission (minimum 5 characters for service info, 10 for notes).
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <FormActions
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    disabled={!selectedCustomer || !selectedVehicle || !selectedMechanic || !serviceInfo.trim() || isSubmitting}
                    submitLabel={isSubmitting ? "Creating..." : "Create Service Job"}
                    loading={isSubmitting}
                />
            </div>
        </motion.div>
    );
}

export default function NewServiceJobPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="h-10 w-64 rounded shimmer" />
                <CardSkeleton count={3} />
            </div>
        }>
            <NewServiceJobContent />
        </Suspense>
    );
}