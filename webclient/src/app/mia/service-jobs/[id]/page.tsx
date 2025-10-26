"use client";

import { motion } from "framer-motion";
import { DetailHeader } from "@/components/mia/service-jobs/DetailHeader";
import { SJCustomerCard } from "@/components/mia/service-jobs/SJCustomerCard";
import { SJVehicleCard } from "@/components/mia/service-jobs/SJVehicleCard";
import { DiagnosisSection } from "@/components/mia/service-jobs/DiagnosisSection";
import { RecommendedFixesSection } from "@/components/mia/service-jobs/RecommendedFixesSection";

export default function ServiceJobDetailPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            <DetailHeader
                title="Service Job Details"
                jobId="SJ-2024-001"
                status="Validated"
                onRevalidate={() => { }}
                onComplete={() => { }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SJCustomerCard name="John Rider" phone="+1 234 567 8900" email="john@example.com" />
                <SJVehicleCard title="Yamaha MT-07" registration="ABC-1234" mileage="12,500 km" />
            </div>

            <DiagnosisSection text={
                "The motorcycle is experiencing irregular engine noise and reduced power output. Initial diagnosis suggests potential issues with the valve timing system. The chain tension appears to be within acceptable limits, but the spark plugs show signs of fouling which could contribute to the power loss."
            } />

            <RecommendedFixesSection items={[
                { title: "Replace spark plugs", description: "Install new NGK Iridium IX plugs" },
                { title: "Valve timing adjustment", description: "Check and adjust valve clearances to spec" },
                { title: "Fuel system cleaning", description: "Clean fuel injectors and air filter" },
            ]} />
        </motion.div>
    );
}