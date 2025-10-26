"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMiaStore } from "@/stores/mia-data-store";

interface AddCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCustomerDialog({ open, onOpenChange }: AddCustomerDialogProps) {
    const { addCustomer } = useMiaStore();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
    });

    const reset = () => setFormData({ id: "", name: "", phone: "", email: "" });

    const handleAdd = () => {
        if (!formData.id || !formData.name || !formData.phone || !formData.email) {
            toast.error("All fields are required");
            return;
        }
        // Store generates the ID and created_at; we persist the core fields.
        addCustomer({ name: formData.name, phone: formData.phone, email: formData.email });
        toast.success("Customer added successfully");
        onOpenChange(false);
        reset();
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
                        <Input
                            id="user_id"
                            placeholder="USR-001"
                            className="mt-1.5"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            placeholder="John Rider"
                            className="mt-1.5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            placeholder="+1 234 567 8900"
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
                            placeholder="john@example.com"
                            className="mt-1.5"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAdd} className="w-full bg-gradient-to-r from-primary to-blue-500">
                        Add Customer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
