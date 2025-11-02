"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function GlowButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
}: GlowButtonProps) {
  const variants = {
    primary: "bg-svitPrimary hover:bg-svitPrimaryDark text-white shadow-[0_0_20px_rgba(11,60,125,0.4)] hover:shadow-[0_0_30px_rgba(11,60,125,0.6)]",
    accent: "bg-svitAccent hover:bg-svitAccentDark text-white shadow-[0_0_20px_rgba(229,168,35,0.4)] hover:shadow-[0_0_30px_rgba(229,168,35,0.6)]",
    ghost: "bg-white/10 hover:bg-white/20 text-svitPrimary border border-svitPrimary/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "rounded-lg font-semibold transition-all duration-300 relative overflow-hidden",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}


