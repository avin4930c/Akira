import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 rounded-2xl bg-[#111111] flex items-center justify-center border border-accent/20 shadow-[0_0_30px_hsl(24_100%_58%/0.15)]">
          <Icon className="w-10 h-10 text-accent" />
        </div>
      </div>
      
      <h3 className="mt-8 text-[18px] font-semibold tracking-tight text-foreground/90">{title}</h3>
      <p className="mt-2 text-[14px] text-muted-foreground max-w-md text-center leading-relaxed">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="mt-8 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white shadow-none font-medium">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
