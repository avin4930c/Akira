"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/common/Navigation";
import MiaSidebar from "@/components/mia/MiaSidebar/MiaSidebar";

export default function MiaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname === "/mia";

    if (isDashboard) {
        return <div className="mia-dark min-h-screen">{children}</div>;
    }

    return (
        <div className="min-h-screen mia-dark">
            <Navigation />

            <div className="flex w-full pt-16">
                <MiaSidebar />

                {/* Main Content */}
                <div className="flex-1 ml-64">

                    {/* Page Content */}
                    <main className="p-8 relative z-10">{children}</main>
                </div>
            </div>
        </div>
    );
}