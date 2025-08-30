"use client";

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface AuthErrorProps {
  error: string;
}

export function AuthError({ error }: AuthErrorProps) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
    >
      <AlertCircle className="h-4 w-4" />
      {error}
    </motion.div>
  );
}
