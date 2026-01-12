"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface VehicleDetailHeaderProps {
    title: string;
    subtitle?: string;
    backHref: string;
}

export function VehicleDetailHeader({ title, subtitle, backHref }: VehicleDetailHeaderProps) {
    const router = useRouter();
    return (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push(backHref)} className="border-primary/30">
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {subtitle ? <p className="text-muted-foreground mt-1">{subtitle}</p> : null}
            </div>
        </div>
    );
}