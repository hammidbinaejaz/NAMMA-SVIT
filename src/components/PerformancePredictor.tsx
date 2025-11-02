"use client";

import { Badge } from "./ui/badge";

export interface StudentPerformance {
  id: string;
  name: string;
  attendance: number;
  averageMarks: number;
  performance: "Excellent" | "Good" | "Average" | "At Risk";
  riskScore: number; // 0-100
}

export function calculatePerformance(
  attendance: number,
  averageMarks: number
): { performance: StudentPerformance["performance"]; riskScore: number } {
  // AI-like logic: Weighted scoring
  const attendanceWeight = 0.4;
  const marksWeight = 0.6;

  const attendanceScore = Math.min(attendance, 100);
  const marksScore = averageMarks;

  const combinedScore = attendanceScore * attendanceWeight + marksScore * marksWeight;
  const riskScore = 100 - combinedScore;

  let performance: StudentPerformance["performance"] = "Average";

  if (combinedScore >= 85 && attendance >= 90 && averageMarks >= 85) {
    performance = "Excellent";
  } else if (combinedScore >= 75 && attendance >= 80 && averageMarks >= 75) {
    performance = "Good";
  } else if (combinedScore >= 60 && attendance >= 70 && averageMarks >= 60) {
    performance = "Average";
  } else {
    performance = "At Risk";
  }

  return { performance, riskScore: Math.round(riskScore) };
}

export function PerformanceBadge({ performance }: { performance: StudentPerformance["performance"] }) {
  const colors = {
    Excellent: "bg-green-100 text-green-800 border-green-300",
    Good: "bg-blue-100 text-blue-800 border-blue-300",
    Average: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "At Risk": "bg-red-100 text-red-800 border-red-300",
  };

  const icons = {
    Excellent: "⭐",
    Good: "✓",
    Average: "⚡",
    "At Risk": "⚠️",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        colors[performance]
      }`}
    >
      <span>{icons[performance]}</span>
      {performance}
    </span>
  );
}
