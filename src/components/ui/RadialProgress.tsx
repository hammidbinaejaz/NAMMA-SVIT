"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RadialProgressProps {
  value: number;
  max: number;
  label: string;
  icon?: React.ReactNode;
  color?: "blue" | "gold";
  subtitle?: string;
}

export default function RadialProgress({
  value,
  max,
  label,
  icon,
  color = "blue",
  subtitle,
}: RadialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: {
      stroke: "#0B3C7D",
      bg: "bg-svitPrimary",
      text: "text-svitPrimary",
      glow: "shadow-[0_0_20px_rgba(11,60,125,0.4)]",
    },
    gold: {
      stroke: "#E5A823",
      bg: "bg-svitAccent",
      text: "text-svitAccent",
      glow: "shadow-[0_0_20px_rgba(229,168,35,0.4)]",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 group cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Icon */}
        {icon && (
          <div className={cn("mb-4 p-3 rounded-full", colors.bg, colors.glow)}>
            {icon}
          </div>
        )}

        {/* Radial Progress Circle */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke={colors.stroke}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn("text-3xl font-bold", colors.text)}>{value}</div>
              <div className="text-xs text-gray-500">of {max}</div>
            </div>
          </div>
        </div>

        {/* Label */}
        <h3 className={cn("text-lg font-semibold mb-1", colors.text)}>{label}</h3>
        {subtitle && (
          <p className="text-xs text-gray-500 text-center">{subtitle}</p>
        )}
      </div>

      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none",
          colors.bg
        )}
      />
    </motion.div>
  );
}

