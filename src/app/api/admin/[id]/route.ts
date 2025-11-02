import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// GET - Read single admin
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        username: true,
        feedbacks: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin" },
      { status: 500 }
    );
  }
}

// PUT - Update admin
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const admin = await prisma.admin.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
      },
    });

    return NextResponse.json(admin);
  } catch (error: any) {
    console.error("Error updating admin:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.admin.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}



