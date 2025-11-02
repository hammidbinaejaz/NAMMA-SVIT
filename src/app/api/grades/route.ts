import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read all grades
export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      select: {
        id: true,
        level: true,
      },
      orderBy: {
        level: "asc",
      },
    });
    return NextResponse.json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Failed to fetch grades" },
      { status: 500 }
    );
  }
}

