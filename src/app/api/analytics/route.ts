import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Calculate attendance trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
            class: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Calculate monthly attendance percentages
    const monthlyStats: Record<string, { present: number; total: number }> = {};
    
    attendanceData.forEach((attendance) => {
      const month = new Date(attendance.date).toLocaleString("en-US", { month: "short" });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { present: 0, total: 0 };
      }
      monthlyStats[month].total++;
      if (attendance.present) {
        monthlyStats[month].present++;
      }
    });

    const attendanceTrend = Object.entries(monthlyStats)
      .map(([month, stats]) => ({
        month,
        percentage: Math.round((stats.present / stats.total) * 100) || 0,
      }))
      .slice(-6); // Last 6 months

    // Calculate top students (by attendance percentage)
    const students = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            date: {
              gte: sixMonthsAgo,
            },
          },
        },
        class: {
          select: { name: true },
        },
      },
    });

    const studentStats = students.map((student) => {
      const total = student.attendances.length;
      const present = student.attendances.filter((a) => a.present).length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      let performance = "Average";
      if (percentage >= 90) performance = "Excellent";
      else if (percentage >= 75) performance = "Good";
      else if (percentage < 75) performance = "At Risk";

      return {
        id: student.id,
        name: `${student.name} ${student.surname}`,
        attendance: percentage,
        performance,
        class: student.class?.name || "N/A",
      };
    });

    const topStudents = studentStats
      .sort((a, b) => b.attendance - a.attendance)
      .slice(0, 5)
      .map((s) => ({
        name: s.name,
        attendance: s.attendance,
        performance: s.performance,
      }));

    const below75 = studentStats
      .filter((s) => s.attendance < 75)
      .map((s) => ({
        name: s.name,
        attendance: s.attendance,
        class: s.class,
      }));

    return NextResponse.json({
      attendanceTrend,
      topStudents,
      below75,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}


