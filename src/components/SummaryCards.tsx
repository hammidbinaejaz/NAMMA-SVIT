import prisma from "@/lib/prisma";
import SummaryCard from "./SummaryCard";
import SummaryCardsClient from "./SummaryCardsClient";

export default async function SummaryCards() {
  // Fetch all counts in parallel
  const [studentsCount, teachersCount, parentsCount, eventsCount, attendanceCount] =
    await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.event.count({
        where: {
          startTime: {
            gte: new Date(),
          },
        },
      }),
      prisma.attendance.count({
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
          present: true,
        },
      }),
    ]);

  return (
    <SummaryCardsClient
      counts={{
        students: studentsCount,
        teachers: teachersCount,
        parents: parentsCount,
        events: eventsCount,
        attendance: attendanceCount,
      }}
    />
  );
}

