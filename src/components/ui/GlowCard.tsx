"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "gold";
}

export default function GlowCard({ children, className, glowColor = "blue" }: GlowCardProps) {
  const glowClass = glowColor === "blue" ? "hover:shadow-[0_0_30px_rgba(11,60,125,0.3)]" : "hover:shadow-[0_0_30px_rgba(229,168,35,0.3)]";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg transition-all duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}



