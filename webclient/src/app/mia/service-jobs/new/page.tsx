"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMiaStore } from "@/stores/mia-data-store";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ServiceJobStatus } from "@/types/mia";
import { useCustomers } from "@/hooks/customer/useCustomer";
import { useVehiclesByCustomerId } from "@/hooks/vehicles/useVehicles";
import { CardSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { NewServiceJobHeader } from "@/components/mia/service-jobs/form/NewServiceJobHeader";
import { SelectCustomerControl } from "@/components/mia/service-jobs/form/SelectCustomerControl";
import { SelectVehicleControl } from "@/components/mia/service-jobs/form/SelectVehicleControl";
import { SelectMechanicControl } from "@/components/mia/service-jobs/form/SelectMechanicControl";
import { ServiceInfoField } from "@/components/mia/service-jobs/form/ServiceInfoField";
import { NotesField } from "@/components/mia/service-jobs/form/NotesField";
import { FormActions } from "@/components/mia/service-jobs/form/FormActions";

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

        if (customerFromUrl) {
            setSelectedCustomer(customerFromUrl);
        }
        if (vehicleFromUrl) {
            setSelectedVehicle(vehicleFromUrl);
        }
    }, [searchParams]);

    const { data: allCustomers, isLoading: loadingCustomers } = useCustomers();
    const { data: customerVehicles, isLoading: loadingVehicles } = useVehiclesByCustomerId(selectedCustomer);

    const { mechanics, addServiceJob } = useMiaStore();

    useEffect(() => {
        if (!searchParams.get("vehicle")) setSelectedVehicle("");
    }, [selectedCustomer]);

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

    const mechanicOptions = mechanics.map((m) => ({
        value: m.id,
        label: m.name,
        subtitle: m.mechanic_code,
    }));

    const handleValidate = () => {
        const trimmedNotes = notes.trim();
        const trimmedServiceInfo = serviceInfo.trim();

        if (!selectedCustomer || !selectedVehicle || !selectedMechanic) {
            toast.error("Please fill all required fields");
            return;
        }
        if (!trimmedServiceInfo || trimmedServiceInfo.length < 5) {
            setShowWarning(true);
            return;
        }
        if (!trimmedNotes || trimmedNotes.length < 10) {
            setShowWarning(true);
            return;
        }

        addServiceJob({
            customer_id: selectedCustomer,
            vehicle_id: selectedVehicle,
            mechanic_id: selectedMechanic,
            service_info: trimmedServiceInfo,
            mechanic_notes: trimmedNotes,
            status: ServiceJobStatus.Validated,
        });

        toast.success("Service job validated and created successfully!");
        router.push("/mia/service-jobs");
    };

    const handleSaveDraft = () => {
        const trimmedServiceInfo = serviceInfo.trim();

        if (!selectedCustomer || !selectedVehicle || !selectedMechanic) {
            toast.error("Please fill all required fields");
            return;
        }
        if (!trimmedServiceInfo || trimmedServiceInfo.length < 5) {
            toast.error("Please provide service information (minimum 5 characters)");
            return;
        }

        addServiceJob({
            customer_id: selectedCustomer,
            vehicle_id: selectedVehicle,
            mechanic_id: selectedMechanic,
            service_info: trimmedServiceInfo,
            mechanic_notes: notes.trim(),
            status: ServiceJobStatus.Pending,
        });

        toast.success("Service job saved as draft");
        router.push("/mia/service-jobs");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <NewServiceJobHeader />
            <div className="glass-card p-8 rounded-xl space-y-6">
                <SelectCustomerControl
                    options={customerOptions}
                    value={selectedCustomer}
                    onChange={(v) => { setSelectedCustomer(v); setShowWarning(false); }}
                    loading={loadingCustomers}
                />

                <SelectVehicleControl
                    options={vehicleOptions}
                    value={selectedVehicle}
                    onChange={(v) => { setSelectedVehicle(v); setShowWarning(false); }}
                    visible={!!selectedCustomer}
                    loading={loadingVehicles}
                />

                <SelectMechanicControl options={mechanicOptions} value={selectedMechanic} onChange={(v) => { setSelectedMechanic(v); setShowWarning(false); }} />

                <ServiceInfoField value={serviceInfo} onChange={(v) => { setServiceInfo(v); setShowWarning(false); }} />

                <NotesField value={notes} onChange={(v) => { setNotes(v); setShowWarning(false); }} />

                {showWarning && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert className="border-yellow-500/50 bg-yellow-500/10">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-500">
                                Missing data detected. Please provide service information and detailed symptoms/diagnosis before validation (minimum 5 characters for service info, 10 for notes).
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <FormActions
                    onValidate={handleValidate}
                    onSaveDraft={handleSaveDraft}
                    disabled={!selectedCustomer || !selectedVehicle || !selectedMechanic || !serviceInfo.trim()}
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