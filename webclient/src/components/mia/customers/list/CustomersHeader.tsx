"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomersHeaderProps {
    onAddClick: () => void;
}

export function CustomersHeader({ onAddClick }: CustomersHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground mt-1">Manage your customer database</p>
            </div>
            <Button onClick={onAddClick} className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
            </Button>
        </div>
    );
}