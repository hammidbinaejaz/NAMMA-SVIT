import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserSex } from "@prisma/client";

// GET - Read single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: { id: true, name: true },
        },
        grade: {
          select: { id: true, level: true },
        },
        parent: {
          select: { id: true, name: true, surname: true, email: true },
        },
        _count: {
          select: {
            attendances: true,
            results: true,
            fees: true,
            certificates: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Remove password from response
    const { password, ...studentWithoutPassword } = student;
    return NextResponse.json(studentWithoutPassword);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PUT - Update student
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
      parentId,
      classId,
      gradeId,
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
    if (parentId !== undefined && parentId !== null && parentId !== "") {
      updateData.parentId = String(parentId);
    }
    if (classId !== undefined && classId !== null && classId !== "") {
      const parsed = typeof classId === "string" ? parseInt(classId, 10) : classId;
      if (!isNaN(parsed)) updateData.classId = parsed;
    }
    if (gradeId !== undefined && gradeId !== null && gradeId !== "") {
      const parsed = typeof gradeId === "string" ? parseInt(gradeId, 10) : gradeId;
      if (!isNaN(parsed)) updateData.gradeId = parsed;
    }

    const student = await prisma.student.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        class: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error updating student:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid parent, class, or grade ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}


