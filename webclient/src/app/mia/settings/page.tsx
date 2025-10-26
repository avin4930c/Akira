"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import EmptyState from "@/components/mia/common/EmptyState";

export default function SettingsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <EmptyState
                icon={Settings}
                title="Settings"
                description="Settings page coming soon. Configure your preferences and system settings here."
            />
        </motion.div>
    );
}
