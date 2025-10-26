"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMiaStore } from "@/stores/mia-data-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ServiceJobStatus } from "@/types/mia";
import { NewServiceJobHeader } from "@/components/mia/service-jobs/NewServiceJobHeader";
import { SelectCustomerControl } from "@/components/mia/service-jobs/SelectCustomerControl";
import { SelectVehicleControl } from "@/components/mia/service-jobs/SelectVehicleControl";
import { SelectMechanicControl } from "@/components/mia/service-jobs/SelectMechanicControl";
import { NotesField } from "@/components/mia/service-jobs/NotesField";
import { FormActions } from "@/components/mia/service-jobs/FormActions";

export default function NewServiceJobPage() {
    const router = useRouter();
    const { customers, getVehiclesByCustomer, mechanics, addServiceJob } = useMiaStore();
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [selectedMechanic, setSelectedMechanic] = useState("");
    const [notes, setNotes] = useState("");
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        setSelectedVehicle("");
    }, [selectedCustomer]);

    const customerOptions = customers.map((c) => ({
        value: c.id,
        label: c.name,
        subtitle: `${c.phone} • ${c.email}`,
    }));

    const vehicleOptions = selectedCustomer
        ? getVehiclesByCustomer(selectedCustomer).map((v) => ({
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
        
        if (!selectedCustomer || !selectedVehicle || !selectedMechanic) {
            toast.error("Please fill all required fields");
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
            notes: notes.trim(),
            status: ServiceJobStatus.Validated,
        });

        toast.success("Service job validated and created successfully!");
        router.push("/mia/service-jobs");
    };

    const handleSaveDraft = () => {
        if (!selectedCustomer || !selectedVehicle || !selectedMechanic) {
            toast.error("Please fill all required fields");
            return;
        }

        addServiceJob({
            customer_id: selectedCustomer,
            vehicle_id: selectedVehicle,
            mechanic_id: selectedMechanic,
            notes: notes.trim(),
            status: ServiceJobStatus.Pending,
        });

        toast.success("Service job saved as draft");
        router.push("/mia/service-jobs");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <NewServiceJobHeader />
            <div className="glass-card p-8 rounded-xl space-y-6">
                <SelectCustomerControl options={customerOptions} value={selectedCustomer} onChange={(v) => { setSelectedCustomer(v); setShowWarning(false); }} />

                <SelectVehicleControl options={vehicleOptions} value={selectedVehicle} onChange={(v) => { setSelectedVehicle(v); setShowWarning(false); }} visible={!!selectedCustomer} />

                <SelectMechanicControl options={mechanicOptions} value={selectedMechanic} onChange={(v) => { setSelectedMechanic(v); setShowWarning(false); }} />

                <NotesField value={notes} onChange={(v) => { setNotes(v); setShowWarning(false); }} count={notes.length} />

                {showWarning && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Alert className="border-yellow-500/50 bg-yellow-500/10">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-500">
                                Missing data detected. Please provide more details about symptoms or parts before validation (minimum 10 characters).
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                <FormActions
                    onValidate={handleValidate}
                    onSaveDraft={handleSaveDraft}
                    disabled={!selectedCustomer || !selectedVehicle || !selectedMechanic}
                />
            </div>
        </motion.div>
    );
}