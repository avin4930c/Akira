"use client";

import { useRouter } from "next/navigation";

interface SJCustomerCardProps {
    customerId?: string;
    vehicleId?: string;
    name: string;
    phone?: string;
    email?: string;
}

export function SJCustomerCard({ customerId, vehicleId, name, phone, email }: SJCustomerCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (vehicleId) {
            router.push(`/mia/vehicles?customer=${customerId}`);
        }
    };

    return (
        <div 
            className={`glass-card p-6 rounded-xl ${vehicleId ? 'cursor-pointer hover:bg-secondary/30 transition-colors' : ''}`}
            onClick={handleClick}
        >
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">CUSTOMER</h3>
            <div className="space-y-2">
                <div className="text-lg font-bold">{name}</div>
                <div className="text-sm text-muted-foreground">{phone}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
            </div>
        </div>
    );
}