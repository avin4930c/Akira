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
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border border-primary/30">
          <Icon className="w-12 h-12 text-primary" />
        </div>
      </div>
      
      <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md text-center">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 bg-gradient-to-r from-primary to-blue-500">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
