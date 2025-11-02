import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomUUID } from "crypto";
import { UserSex } from "@prisma/client";

// GET - Read all teachers
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodType: true,
        sex: true,
        birthday: true,
        createdAt: true,
        _count: {
          select: {
            subjects: true,
            lessons: true,
            classes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// POST - Create teacher
export async function POST(request: NextRequest) {
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

    if (!username || !password || !name || !surname) {
      return NextResponse.json(
        { error: "Username, password, name, and surname are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const id = randomUUID();

    const teacher = await prisma.teacher.create({
      data: {
        id,
        username,
        password: hashedPassword,
        name,
        surname,
        email: email || null,
        phone: phone || null,
        address: address || "",
        img: img || null,
        bloodType: bloodType || "O+",
        sex: (sex === "FEMALE" ? UserSex.FEMALE : UserSex.MALE) || UserSex.MALE,
        birthday: birthday ? new Date(birthday) : new Date(),
        subjects: subjectIds
          ? {
              connect: subjectIds.map((id: number) => ({ id })),
            }
          : undefined,
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create teacher" },
      { status: 500 }
    );
  }
}


