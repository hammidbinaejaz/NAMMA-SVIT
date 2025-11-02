"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";
import { PerformanceBadge } from "./PerformancePredictor";

interface TopStudent {
  id: string;
  name: string;
  surname: string;
  attendancePercentage: number;
  averageMarks: number;
  performance: "Excellent" | "Good" | "Average" | "At Risk";
}

export default function TopStudentsList() {
  const [students, setStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .filter((s: TopStudent) => s.performance && (s.performance === "Excellent" || s.performance === "Good"))
          .sort((a: TopStudent, b: TopStudent) => {
            const scoreA = (a.attendancePercentage || 0) * 0.4 + (a.averageMarks || 0) * 0.6;
            const scoreB = (b.attendancePercentage || 0) * 0.4 + (b.averageMarks || 0) * 0.6;
            return scoreB - scoreA;
          })
          .slice(0, 5);
        setStudents(sorted);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Award className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">No top students yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[350px]">
      {students.map((student, index) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD24A] font-bold">#{index + 1}</span>
              <span className="font-medium text-white">
                {student.name} {student.surname}
              </span>
            </div>
            <PerformanceBadge performance={student.performance} />
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Att: {student.attendancePercentage || 0}%</span>
            </div>
            <div>
              <span>Marks: {student.averageMarks || 0}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


