"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import GlowCard from "./ui/GlowCard";
import Link from "next/link";

interface SummaryCardClientProps {
  title: string;
  count: number;
  icon: LucideIcon;
  color: "blue" | "gold";
  subtitle?: string;
  href?: string;
}

export default function SummaryCardClient({
  title,
  count,
  icon: Icon,
  color,
  subtitle,
  href,
}: SummaryCardClientProps) {
  const colorClasses = {
    blue: {
      bg: "bg-svitPrimary/10",
      icon: "text-svitPrimary",
      border: "border-svitPrimary/20",
      hover: "hover:shadow-[0_0_30px_rgba(11,60,125,0.3)]",
      glow: "hover:bg-svitPrimary/15",
    },
    gold: {
      bg: "bg-svitAccent/10",
      icon: "text-svitAccent",
      border: "border-svitAccent/20",
      hover: "hover:shadow-[0_0_30px_rgba(229,168,35,0.3)]",
      glow: "hover:bg-svitAccent/15",
    },
  };

  const colors = colorClasses[color];

  const content = (
    <GlowCard
      className={`${colors.hover} ${colors.glow} transition-all duration-300 cursor-pointer h-full`}
      glowColor={color}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex p-3 rounded-xl mb-3 ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-800">{count}</span>
            {subtitle && (
              <span className="text-xs text-gray-400">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={href} className="block">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {content}
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}



