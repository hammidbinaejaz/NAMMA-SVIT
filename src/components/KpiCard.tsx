"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, GraduationCap, UserCheck, ClipboardCheck } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  iconName: string;
  href?: string;
  delay?: number;
}

const iconComponents: Record<string, React.ReactNode> = {
  Users: <Users className="w-5 h-5 text-primary" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-primary" />,
  UserCheck: <UserCheck className="w-5 h-5 text-primary" />,
  ClipboardCheck: <ClipboardCheck className="w-5 h-5 text-primary" />,
};

export default function KpiCard({
  title,
  value,
  iconName,
  href,
  delay = 0,
}: KpiCardProps) {
  const Icon = iconComponents[iconName] || iconComponents.Users;
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="relative overflow-hidden backdrop-blur-xl rounded-xl p-5 cursor-pointer border border-white/10"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      {/* Inner glow on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-[#FACC15]/10 via-blue-600/10 to-purple-600/10 rounded-xl"
      />
      <div className="relative z-10">
        <p className="text-textSecondary text-sm font-medium mb-1">{title}</p>
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-2xl font-semibold text-textPrimary">{value}</h2>
          <div className="p-2 bg-primary/10 rounded-lg">
            {Icon}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

