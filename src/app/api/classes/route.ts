import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

