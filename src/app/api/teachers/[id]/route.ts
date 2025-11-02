import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserSex } from "@prisma/client";

// GET - Read single teacher
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        subjects: {
          select: { id: true, name: true },
        },
        classes: {
          select: { id: true, name: true },
        },
        lessons: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            subjects: true,
            lessons: true,
            classes: true,
            feedbacks: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...teacherWithoutPassword } = teacher;
    return NextResponse.json(teacherWithoutPassword);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
      { status: 500 }
    );
  }
}

// PUT - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      username,
      password,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      birthday,
      subjectIds,
    } = body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) {
      updateData.password = await hashPassword(password);
    }
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address) updateData.address = address;
    if (img !== undefined) updateData.img = img || null;
    if (bloodType) updateData.bloodType = bloodType;
    if (sex) updateData.sex = (sex === "FEMALE" ? UserSex.FEMALE : UserSex.MALE);
    if (birthday) updateData.birthday = new Date(birthday);

    if (subjectIds) {
      updateData.subjects = {
        set: subjectIds.map((id: number) => ({ id })),
      };
    }

    const teacher = await prisma.teacher.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("Error updating teacher:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update teacher" },
      { status: 500 }
    );
  }
}

// DELETE - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.teacher.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting teacher:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete teacher" },
      { status: 500 }
    );
  }
}


