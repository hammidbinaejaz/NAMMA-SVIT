"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Award, Users } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  attendanceTrend: { month: string; percentage: number }[];
  topStudents: { name: string; attendance: number; performance: string }[];
  below75: { name: string; attendance: number; class: string }[];
}

export default function SmartAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setData({
          attendanceTrend: [
            { month: "Jan", percentage: 85 },
            { month: "Feb", percentage: 88 },
            { month: "Mar", percentage: 82 },
            { month: "Apr", percentage: 90 },
            { month: "May", percentage: 87 },
            { month: "Jun", percentage: 91 },
          ],
          topStudents: [
            { name: "Rajesh Kumar", attendance: 98, performance: "Excellent" },
            { name: "Priya Sharma", attendance: 96, performance: "Excellent" },
            { name: "Amit Patel", attendance: 94, performance: "Excellent" },
          ],
          below75: [
            { name: "Suresh Reddy", attendance: 68, class: "10A" },
            { name: "Kavya Nair", attendance: 72, class: "9B" },
          ],
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
            <div className="h-4 bg-background rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-background rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-textPrimary">Attendance Trend (6 Months)</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data?.attendanceTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: "#2563EB", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-textPrimary">Top Students</h3>
        </div>
        <div className="space-y-3">
          {data?.topStudents?.slice(0, 5).map((student, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-background rounded-lg"
            >
              <div>
                <p className="font-medium text-textPrimary text-sm">{student.name}</p>
                <p className="text-xs text-textSecondary">{student.attendance}% Attendance</p>
              </div>
              <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                {student.performance}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Below 75% Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="lg:col-span-3 bg-red-50 border-2 border-red-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Below 75% Attendance Alert</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data?.below75?.length ? (
            data.below75.map((student, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-red-200 shadow-sm"
              >
                <p className="font-medium text-red-900 text-sm">{student.name}</p>
                <p className="text-xs text-red-700 mt-1">{student.class}</p>
                <p className="text-lg font-bold text-red-600 mt-2">{student.attendance}%</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-red-700 py-4">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No students below 75% attendance</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

