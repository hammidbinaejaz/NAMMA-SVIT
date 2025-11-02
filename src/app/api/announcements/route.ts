import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read all announcements
export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// POST - Create announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, classId, date } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        classId: classId ? parseInt(classId) : null,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error: any) {
    console.error("Error creating announcement:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid class ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}


