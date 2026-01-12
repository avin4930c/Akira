"use client";

import { motion } from "framer-motion";
import { RepairTasksSection } from "@/components/mia/service-jobs/main/RepairTasksSection";
import { SuggestedPartsSection } from "@/components/mia/service-jobs/main/SuggestedPartsSection";
import { TipsSection } from "@/components/mia/service-jobs/main/TipsSection";
import { DetailHeader } from "@/components/mia/service-jobs/detail/DetailHeader";
import { JobSummaryFooter } from "@/components/mia/service-jobs/detail/JobSummaryFooter";
import { SJCustomerCard } from "@/components/mia/service-jobs/detail/SJCustomerCard";
import { SJVehicleCard } from "@/components/mia/service-jobs/detail/SJVehicleCard";
import { DiagnosisSection } from "@/components/mia/service-jobs/main/DiagnosisSection";
import { mockServiceJobData } from "@/app/mocks/data/mockServiceJobData";

export default function ServiceJobDetailPage() {
    const serviceJobData = mockServiceJobData;

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
                <SJVehicleCard title="2025 Honda CBR650R" registration="ABC-1234" mileage="6,000 miles" />
            </div>

            <DiagnosisSection text={serviceJobData.diagnosis_summary} />

            <RepairTasksSection tasks={serviceJobData.repair_tasks} />

            <SuggestedPartsSection parts={serviceJobData.suggested_parts} />

            <TipsSection tips={serviceJobData.tips} />

            <JobSummaryFooter
                estimatedTotalMinutes={serviceJobData.estimated_total_minutes}
                priorityLevel={serviceJobData.priority_level}
                warrantyNotes={serviceJobData.warranty_notes}
                followUpRecommendations={serviceJobData.follow_up_recommendations}
            />
        </motion.div>
    );
}