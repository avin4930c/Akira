import { motion } from "framer-motion";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="h-14 rounded-lg shimmer"
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#111111] border border-border/10 p-6 rounded-xl space-y-4"
        >
          <div className="h-6 w-32 rounded shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-24 rounded shimmer" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-20 rounded shimmer" />
            <div className="h-8 w-20 rounded shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
