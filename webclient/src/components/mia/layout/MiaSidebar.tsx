"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Car, Wrench, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import MiaLogo from "./MiaLogo";
import MiaFooter from "./MiaFooter";

const navigation = [
  { name: "Customers", href: "/mia/customers", icon: Users },
  { name: "Vehicles", href: "/mia/vehicles", icon: Car },
  { name: "Service Jobs", href: "/mia/service-jobs", icon: Wrench },
  { name: "Settings", href: "/mia/settings", icon: Settings },
];

export default function MiaSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 glass-card border-r fixed left-0 top-16 h-[calc(100vh-4rem)] z-40"
    >
      <div className="flex flex-col h-full">
        <MiaLogo />

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <MiaFooter />
      </div>
    </motion.aside>
  );
}