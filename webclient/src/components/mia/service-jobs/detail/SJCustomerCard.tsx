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
            className={`w-full bg-[#111111] border border-border/10 rounded-xl p-6 relative group overflow-hidden ${vehicleId ? 'cursor-pointer hover:border-accent/30 transition-colors group' : ''}`}
            onClick={handleClick}
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="w-32 h-32 bg-accent/5 rounded-full blur-2xl transform translate-x-6 -translate-y-6" />
            </div>

            <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-border/5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent/80"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <span className="text-[15px] font-medium text-accent tracking-wide uppercase">Customer</span>
                </div>
            </div>

            <div className="space-y-1.5 relative z-10 pl-2">
                <div className="text-lg sm:text-xl font-semibold text-zinc-100 group-hover:text-accent transition-colors">{name}</div>
                {(phone || email) && (
                    <div className="pt-2 text-[15px] text-zinc-400 font-mono tracking-wide flex flex-col gap-1">
                        {email && <span className="text-zinc-300">{email}</span>}
                        {phone && <span className="text-zinc-400">{phone}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}