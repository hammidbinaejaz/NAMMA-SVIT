"use client";

import KpiCard from "./KpiCard";

interface SummaryCardsClientProps {
  counts: {
    students: number;
    teachers: number;
    parents: number;
    events: number;
    attendance: number;
  };
}

export default function SummaryCardsClient({ counts }: SummaryCardsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Students"
        value={counts.students}
        iconName="Users"
        href="/list/students"
        delay={0}
      />
      <KpiCard
        title="Faculty"
        value={counts.teachers}
        iconName="GraduationCap"
        href="/list/teachers"
        delay={0.1}
      />
      <KpiCard
        title="Parents"
        value={counts.parents}
        iconName="UserCheck"
        href="/list/parents"
        delay={0.2}
      />
      <KpiCard
        title="Attendance"
        value={counts.students > 0 ? `${Math.round((counts.attendance / counts.students) * 100)}%` : "0%"}
        iconName="ClipboardCheck"
        href="/list/attendance"
        delay={0.3}
      />
    </div>
  );
}

