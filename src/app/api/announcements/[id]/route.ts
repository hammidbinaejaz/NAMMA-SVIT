import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read single announcement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}

// PUT - Update announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, classId, date } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (classId !== undefined) updateData.classId = classId ? parseInt(classId) : null;
    if (date) updateData.date = new Date(date);

    const announcement = await prisma.announcement.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        class: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error("Error updating announcement:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid class ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.announcement.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete announcement" },
      { status: 500 }
    );
  }
}


