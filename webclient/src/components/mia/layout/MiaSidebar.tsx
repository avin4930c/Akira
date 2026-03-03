"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Car, Wrench, Settings, X } from "lucide-react";
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

interface MiaSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function MiaSidebar({ open, onClose }: MiaSidebarProps) {
  const pathname = usePathname();

  const sidebar = (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between p-4">
        <MiaLogo />
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/10 border border-transparent"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", isActive ? "text-primary" : "")}
                />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/10">
        <MiaFooter />
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:block w-64 border-r border-border/10 fixed left-0 top-[76px] h-[calc(100vh-76px)] z-40 bg-background/30 backdrop-blur-xl overflow-hidden"
      >
        {sidebar}
      </motion.aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden w-[280px] border-r border-border/10 fixed left-0 top-0 h-screen z-[60] bg-background/80 backdrop-blur-xl overflow-hidden pt-4"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}