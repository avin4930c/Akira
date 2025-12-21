"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddCustomerMutation } from "@/hooks/customer/useCustomer";
import { v4 as uuidv4 } from "uuid";

interface AddCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCustomerDialog({ open, onOpenChange }: AddCustomerDialogProps) {
    const addCustomerMutation = useAddCustomerMutation();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
    });

    const reset = () => setFormData({ id: "", name: "", phone: "", email: "" });

    const handleAdd = async () => {
        if (!formData.id || !formData.name || !formData.phone || !formData.email) {
            toast.error("All fields are required");
            return;
        }
        
        try {
            await addCustomerMutation.mutateAsync({
                id: formData.id,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                vehicle_count: 0,
                created_at: new Date().toISOString(),
            });
            toast.success("Customer added successfully");
            onOpenChange(false);
            reset();
        } catch (error) {
            toast.error("Failed to add customer");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card border-primary/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="user_id">User ID *</Label>
                        <div className="mt-1.5 flex gap-2 items-center">
                            <Input
                                id="user_id"
                                placeholder="e.g., USR-001 or generated UUID"
                                className="flex-1"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({ ...formData, id: uuidv4() })}
                                title="Generate UUID"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g., John Rider"
                            className="mt-1.5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            placeholder="e.g., +1 234 567 8900"
                            className="mt-1.5"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g., john@example.com"
                            className="mt-1.5"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <Button 
                        onClick={handleAdd} 
                        className="w-full bg-gradient-to-r from-primary to-blue-500"
                        disabled={addCustomerMutation.isPending}
                    >
                        {addCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
