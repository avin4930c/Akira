"use client";

import { useRouter } from "next/navigation";

interface SJVehicleCardProps {
    vehicleId?: string;
    title: string;
    registration: string;
    mileage: number | string;
}

export function SJVehicleCard({ vehicleId, title, registration, mileage }: SJVehicleCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (vehicleId) {
            router.push(`/mia/vehicles/${vehicleId}`);
        }
    };

    return (
        <div 
            className={`w-full bg-[#111111] border border-border/10 rounded-xl p-6 relative group overflow-hidden ${vehicleId ? 'cursor-pointer hover:border-blue-500/30 transition-colors group' : ''}`}
            onClick={handleClick}
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="w-32 h-32 bg-blue-500/5 rounded-full blur-2xl transform translate-x-6 -translate-y-6" />
            </div>

            <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-border/5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500/80"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                    <span className="text-[15px] font-medium text-blue-500 tracking-wide uppercase">Vehicle</span>
                </div>
            </div>

            <div className="space-y-1.5 relative z-10 pl-2">
                <div className="text-lg sm:text-xl font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">{title}</div>
                <div className="pt-2 text-[15px] text-zinc-400 font-mono tracking-wide flex flex-col gap-1">
                    <span>Reg: <span className="text-zinc-300 ml-1">{registration}</span></span>
                    <span>ODO: <span className="text-zinc-300 ml-1">{mileage} km</span></span>
                </div>
            </div>
        </div>
    );
}