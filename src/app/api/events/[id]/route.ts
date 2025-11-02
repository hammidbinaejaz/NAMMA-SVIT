import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, classId } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (classId !== undefined && classId !== null && classId !== "") {
      const parsed = typeof classId === "string" ? parseInt(classId, 10) : classId;
      updateData.classId = !isNaN(parsed) ? parsed : null;
    } else if (classId === null || classId === "") {
      updateData.classId = null;
    }

    const event = await prisma.event.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error: any) {
    console.error("Error updating event:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid class ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete event" },
      { status: 500 }
    );
  }
}


