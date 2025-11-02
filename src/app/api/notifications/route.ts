import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Fetch notifications for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock notifications
    // In production, link to actual Notification model in Prisma
    const mockNotifications = [
      {
        id: "1",
        title: "New Assignment Posted",
        message: "Mathematics Assignment #5 has been posted. Due: 3 days",
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        link: "/list/assignments",
      },
      {
        id: "2",
        title: "Attendance Alert",
        message: "Your attendance is below 75%. Please improve.",
        type: "warning",
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: "/list/attendance",
      },
      {
        id: "3",
        title: "Exam Results Published",
        message: "Mid-term exam results are now available.",
        type: "success",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/list/results",
      },
    ];

    return NextResponse.json(mockNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Create notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type = "info", link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // In production, save to database
    // For now, return success
    return NextResponse.json({
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      link,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}


