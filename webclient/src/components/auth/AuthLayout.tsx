"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-shimmer">Akira</h1>
                    </Link>
                </div>

                <Card className="glass shadow-elegant">
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                        {children}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
