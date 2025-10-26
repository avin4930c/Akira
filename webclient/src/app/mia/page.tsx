"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wrench } from "lucide-react";
import Link from "next/link";

export default function MiaDashboardPage() {
    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8 relative z-10 px-4"
            >
                <div className="space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-2xl shadow-primary/50"
                    >
                        <Wrench className="w-10 h-10 text-white" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-blue-500 bg-clip-text text-transparent">
                        Akira MIA
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Intelligent Motorcycle Service Assistant
                    </p>

                    <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
                        AI-powered diagnostics and service management for modern mechanics
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        href="/mia/customers"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-primary to-blue-500 px-8 py-6 text-lg font-medium text-white shadow-2xl shadow-primary/30 hover:opacity-90 transition-opacity"
                    >
                        Enter Workshop
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
