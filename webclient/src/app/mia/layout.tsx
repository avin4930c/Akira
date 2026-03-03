"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Navigation from "@/components/common/Navigation";
import MiaSidebar from "@/components/mia/layout/MiaSidebar";

export default function MiaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname === "/mia";
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isDashboard) {
        return <div className="mia-dark min-h-screen">{children}</div>;
    }

    return (
        <div className="min-h-screen mia-dark">
            <Navigation />

            <div className="flex w-full pt-16">
                <MiaSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <div className="flex-1 md:ml-64">
                    {/* Mobile sidebar toggle */}
                    <div className="md:hidden sticky top-16 z-30 flex items-center gap-2 px-4 py-2 glass-card border-b border-border/50">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-muted-foreground">Menu</span>
                    </div>

                    {/* Page Content */}
                    <main className="p-4 md:p-8 relative z-10">{children}</main>
                </div>
            </div>
        </div>
    );
}