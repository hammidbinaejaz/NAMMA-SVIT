"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface WidgetCardProps {
  title: string;
  iconName: string;
  children: ReactNode;
  viewAllHref?: string;
  className?: string;
}

// Icon component map
const iconMap: Record<string, React.ReactNode> = {
  Bell: <BellIcon />,
  Calendar: <CalendarIcon />,
  TrendingUp: <TrendingUpIcon />,
  QrCode: <QrCodeIcon />,
};

function BellIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function QrCodeIcon() {
  return (
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );
}

export default function WidgetCard({
  title,
  iconName,
  children,
  viewAllHref,
  className = "",
}: WidgetCardProps) {
  const Icon = iconMap[iconName] || iconMap.Bell;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl p-4 md:p-6 flex flex-col gap-4 backdrop-blur-xl border border-white/10 ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-textPrimary flex items-center gap-2">
          {Icon}
          {title}
        </h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary hover:underline font-medium"
          >
            View All
          </Link>
        )}
      </div>
      <div className="flex-1 overflow-y-auto relative z-10">{children}</div>
    </motion.div>
  );
}

