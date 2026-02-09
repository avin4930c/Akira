"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RepairTasksSection } from "@/components/mia/service-jobs/main/RepairTasksSection";
import { SuggestedPartsSection } from "@/components/mia/service-jobs/main/SuggestedPartsSection";
import { TipsSection } from "@/components/mia/service-jobs/main/TipsSection";
import { DetailHeader } from "@/components/mia/service-jobs/detail/DetailHeader";
import { JobSummaryFooter } from "@/components/mia/service-jobs/detail/JobSummaryFooter";
import { SJCustomerCard } from "@/components/mia/service-jobs/detail/SJCustomerCard";
import { SJVehicleCard } from "@/components/mia/service-jobs/detail/SJVehicleCard";
import { DiagnosisSection } from "@/components/mia/service-jobs/main/DiagnosisSection";
import { CardSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { ServiceJobStatus, ProcessingStage } from "@/types/mia";
import { ProcessingProgress } from "@/components/mia/service-jobs/components/ProcessingProgress";
import { useServiceJobSSE } from "@/hooks/service-job/useServiceJobSSE";
import EmptyState from "@/components/mia/common/EmptyState";
import { AlertCircle } from "lucide-react";
import { useServiceJobById, useValidateServiceJob } from "@/hooks/service-job/useServiceJob";
import { useServiceJobInvalidation } from "@/hooks/service-job/useServiceJobInvalidation";

export default function ServiceJobDetailPage() {
    const {id: jobId} = useParams() as { id: string };
    const router = useRouter();
    
    const { data: serviceJob, isLoading, error, refetch } = useServiceJobById(jobId);
    const { invalidateJob } = useServiceJobInvalidation();
    
    const { processingState, connect: connectSSE, isConnected } = useServiceJobSSE({
        onComplete: () => {
            toast.success("Processing complete!");
            invalidateJob(jobId);
            refetch();
        },
        onError: (_, errorMsg) => {
            toast.error(`Processing failed: ${errorMsg}`);
            refetch();
        },
    });

    const isJobProcessing = serviceJob?.status === ServiceJobStatus.InProgress || 
        (serviceJob?.processing_stage && 
         serviceJob.processing_stage !== ProcessingStage.Completed &&
         serviceJob.processing_stage !== ProcessingStage.Failed);

    useEffect(() => {
        if (isJobProcessing && !isConnected) {
            connectSSE(jobId);
        }
    }, [isJobProcessing, isConnected, jobId, connectSSE]);

    const validateMutation = useValidateServiceJob({
        onSuccess: () => toast.success("Service job validated successfully!"),
        onError: (error: Error) => toast.error(`Failed to validate: ${error.message}`),
    });

    const handleValidate = () => validateMutation.mutate(jobId);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <CardSkeleton count={4} />
            </div>
        );
    }

    if (error || !serviceJob) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Service Job Not Found"
                description="The service job you're looking for doesn't exist or has been deleted."
                actionLabel="Back to Jobs"
                onAction={() => router.push("/mia/service-jobs")}
            />
        );
    }

    if (serviceJob.status === ServiceJobStatus.Failed || serviceJob.processing_stage === ProcessingStage.Failed) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="Processing Failed"
                description={serviceJob.error_details || "The service job processing failed. Please try again."}
                actionLabel="Back to Jobs"
                onAction={() => router.push("/mia/service-jobs")}
            />
        );
    }

    const technicalPlan = serviceJob.enriched_technical_plan?.technical_plan;
    const partsAvailability = serviceJob.enriched_technical_plan?.parts_availability;
    const customer = serviceJob.customer;
    const vehicle = serviceJob.vehicle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            <DetailHeader
                title="Service Job Details"
                jobId={jobId}
                status={serviceJob.status}
                onRevalidate={() => {}}
                onValidate={handleValidate}
            />

            <AnimatePresence>
                {isJobProcessing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <ProcessingProgress 
                            state={processingState || {
                                jobId,
                                stage: serviceJob.processing_stage || ProcessingStage.Queued,
                                stageLabel: "Processing...",
                                progress: 0,
                                error: serviceJob.error_details,
                                isProcessing: true,
                                isComplete: false,
                                isFailed: false,
                            }} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SJCustomerCard 
                    customerId={customer?.id}
                    vehicleId={vehicle?.id}
                    name={customer?.name ?? "Unknown"} 
                    phone={customer?.phone ?? "-"} 
                    email={customer?.email ?? "-"} 
                />
                <SJVehicleCard 
                    vehicleId={vehicle?.id}
                    title={`${vehicle?.year ?? ""} ${vehicle?.make ?? ""} ${vehicle?.model ?? ""}`}
                    registration={vehicle?.registration ?? "-"}
                    mileage={vehicle?.mileage ?? "-"}
                />
            </div>

            {technicalPlan ? (
                <>
                    <DiagnosisSection text={technicalPlan.diagnosis_summary} />
                    <RepairTasksSection tasks={technicalPlan.repair_tasks} />
                    <SuggestedPartsSection 
                        parts={technicalPlan.suggested_parts} 
                        partsAvailability={partsAvailability}
                    />
                    <TipsSection tips={technicalPlan.tips} />
                    <JobSummaryFooter
                        estimatedTotalMinutes={technicalPlan.estimated_total_minutes}
                        priorityLevel={technicalPlan.priority_level}
                        warrantyNotes={technicalPlan.warranty_notes}
                        followUpRecommendations={technicalPlan.follow_up_recommendations}
                    />
                </>
            ) : (
                !isJobProcessing && (
                    <div className="glass-card p-8 rounded-xl text-center">
                        <p className="text-muted-foreground">
                            No technical plan available yet. The job may still be processing.
                        </p>
                    </div>
                )
            )}
        </motion.div>
    );
}