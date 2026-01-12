"use client";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddCustomerMutation } from "@/hooks/customer/useCustomer";
import { v4 as uuidv4 } from "uuid";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, type CreateCustomerInput } from "@/schema/customer";
import { FormField } from "@/components/mia/common/FormField";

interface AddCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCustomerDialog({ open, onOpenChange }: AddCustomerDialogProps) {
    const addCustomerMutation = useAddCustomerMutation();
    
    const form = useForm<CreateCustomerInput>({
        resolver: zodResolver(createCustomerSchema) as Resolver<CreateCustomerInput>,
        defaultValues: {
            id: "",
            name: "",
            phone: "",
            email: "",
        },
    });

    const handleGenerateId = () => {
        form.setValue("id", uuidv4());
    };

    async function onSubmit(values: CreateCustomerInput) {
        try {
            await addCustomerMutation.mutateAsync({
                ...values,
                vehicle_count: 0,
                created_at: new Date().toISOString(),
            });
            toast.success("Customer added successfully");
            onOpenChange(false);
            form.reset();
        } catch (error) {
            toast.error("Failed to add customer");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card border-primary/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Add New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="user_id">User ID *</Label>
                        <div className="mt-1.5 flex gap-2 items-center">
                            <Input
                                id="user_id"
                                placeholder="e.g., USR-001 or generated UUID"
                                className="flex-1"
                                {...form.register("id")}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateId}
                                title="Generate UUID"
                            >
                                Generate
                            </Button>
                        </div>
                        {form.formState.errors.id && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.id.message}</p>
                        )}
                    </div>

                    <FormField
                        id="name"
                        label="Full Name"
                        placeholder="e.g., John Rider"
                        register={form.register}
                        fieldName="name"
                        errors={form.formState.errors}
                        required
                    />

                    <FormField
                        id="phone"
                        label="Phone Number"
                        placeholder="e.g., +1 234 567 8900"
                        type="tel"
                        register={form.register}
                        fieldName="phone"
                        errors={form.formState.errors}
                        required
                    />

                    <FormField
                        id="email"
                        label="Email Address"
                        placeholder="e.g., john@example.com"
                        type="email"
                        register={form.register}
                        fieldName="email"
                        errors={form.formState.errors}
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-blue-500"
                        disabled={addCustomerMutation.isPending}
                    >
                        {addCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}