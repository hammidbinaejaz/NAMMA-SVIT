"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const AttendanceChart = dynamic(
  () => import("recharts").then((mod) => {
    const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } = mod;
    return ({ data }: { data: any[] }) => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9CA3AF" domain={[0, 100]} style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#FFD24A"
            strokeWidth={2}
            dot={{ fill: "#FFD24A", r: 4 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }),
  { ssr: false }
);

interface TrendData {
  date: string;
  attendance: number;
}

export default function AttendanceTrendChart() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate last 7 days trend data
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        attendance: 75 + Math.random() * 20, // Mock data: 75-95%
      });
    }
    setData(days);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="h-full bg-white/5 rounded-lg animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <AttendanceChart data={data} />
    </motion.div>
  );
}

