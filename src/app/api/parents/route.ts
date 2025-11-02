import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Read all parents
export async function GET() {
  try {
    const parents = await prisma.parent.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(parents);
  } catch (error) {
    console.error("Error fetching parents:", error);
    return NextResponse.json(
      { error: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}


