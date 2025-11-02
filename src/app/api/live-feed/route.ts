import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch recent events
    const recentEvents = await prisma.event.findMany({
      take: 3,
      orderBy: { startTime: "desc" },
      where: {
        startTime: {
          gte: new Date(),
        },
      },
    });

    // Fetch recent announcements
    const recentAnnouncements = await prisma.announcement.findMany({
      take: 2,
      orderBy: { date: "desc" },
    });

    // Generate feed items
    const items: Array<{
      id: string;
      type: "event" | "announcement" | "attendance" | "alert";
      message: string;
      timestamp: string;
    }> = [];

    // Add events
    recentEvents.forEach((event) => {
      const timeUntil = Math.round(
        (event.startTime.getTime() - Date.now()) / (1000 * 60)
      );
      if (timeUntil > 0 && timeUntil < 60) {
        items.push({
          id: `event-${event.id}`,
          type: "event",
          message: `🚀 ${event.title} starts in ${timeUntil} mins!`,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Add announcements
    recentAnnouncements.forEach((announcement) => {
      items.push({
        id: `announcement-${announcement.id}`,
        type: "announcement",
        message: `📢 ${announcement.title}`,
        timestamp: announcement.date.toISOString(),
      });
    });

    // Add mock attendance update
    const attendanceCount = await prisma.attendance.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        present: true,
      },
    });

    items.push({
      id: `attendance-${Date.now()}`,
      type: "attendance",
      message: `✅ ${attendanceCount} students marked present today`,
      timestamp: new Date().toISOString(),
    });

    // Sort by timestamp (newest first)
    items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching live feed:", error);
    // Return mock data on error
    return NextResponse.json({
      items: [
        {
          id: "1",
          type: "event",
          message: "🚀 Robotics Club Workshop starts in 10 mins!",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          type: "announcement",
          message: "📢 New library hours announced",
          timestamp: new Date(Date.now() - 60000).toISOString(),
        },
      ],
    });
  }
}

