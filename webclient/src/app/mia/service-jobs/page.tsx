"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import EmptyState from "@/components/mia/common/EmptyState";
import { TableSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { useRouter } from "next/navigation";
import { ServiceJobsHeader } from "@/components/mia/service-jobs/ServiceJobsHeader";
import { ServiceJobsTable, type ServiceJobRow } from "@/components/mia/service-jobs/ServiceJobsTable";

type ServiceJob = ServiceJobRow;

export default function ServiceJobsPage() {
  const router = useRouter();
  const [isLoading] = useState(false);
  const [jobs] = useState<ServiceJob[]>([
    {
      id: "1",
      jobId: "SJ-2024-001",
      customer: "John Rider",
      vehicle: "Yamaha MT-07",
      status: "validated",
      lastUpdated: "2024-03-15",
    },
    {
      id: "2",
      jobId: "SJ-2024-002",
      customer: "Sarah Biker",
      vehicle: "Honda CBR650R",
      status: "draft",
      lastUpdated: "2024-03-14",
    },
  ]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 rounded shimmer" />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={Wrench}
        title="No active service jobs"
        description="Create your first service job to start tracking repairs and maintenance."
        actionLabel="Start New Job"
        onAction={() => router.push("/mia/service-jobs/new")}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ServiceJobsHeader onNew={() => router.push("/mia/service-jobs/new")} />
      <ServiceJobsTable jobs={jobs} onView={(id) => router.push(`/mia/service-jobs/${id}`)} />
    </motion.div>
  );
}