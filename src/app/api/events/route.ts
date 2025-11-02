import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, classId } = body;

    if (!title || !description || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, description, startTime, and endTime are required" },
        { status: 400 }
      );
    }

    // Safely parse classId
    let parsedClassId: number | null = null;
    if (classId !== undefined && classId !== null && classId !== "") {
      const parsed = typeof classId === "string" ? parseInt(classId, 10) : classId;
      if (!isNaN(parsed)) parsedClassId = parsed;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        classId: parsedClassId,
      },
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid class ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}


