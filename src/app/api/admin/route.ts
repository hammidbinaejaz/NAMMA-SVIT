import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomUUID } from "crypto";

// GET - Read all admins
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        feedbacks: {
          select: { id: true },
        },
      },
    });
    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST - Create admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const id = randomUUID();

    const admin = await prisma.admin.create({
      data: {
        id,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}



