import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { randomUUID } from "crypto";
import { UserSex } from "@prisma/client";

// Helper: Safely convert to string or number
function safeString(value: string | number | undefined | null): string | undefined {
  if (!value || value === "") return undefined;
  return String(value);
}

function safeInt(value: string | number | undefined | null): number | undefined {
  if (!value || value === "") return undefined;
  const parsed = typeof value === "string" ? parseInt(value, 10) : value;
  return isNaN(parsed) ? undefined : parsed;
}

// Helper: Auto-create missing parent/class/grade
async function ensureParentExists(parentId?: string | null): Promise<string | null> {
  if (!parentId || parentId === "") {
    // Create a dummy parent
    const dummyParent = await prisma.parent.create({
      data: {
        id: randomUUID(),
        username: `parent-${Date.now()}`,
        password: await hashPassword("dummy123"),
        name: "Dummy",
        surname: "Parent",
        phone: "0000000000",
        address: "Auto-created",
      },
    });
    console.log("✅ Auto-created dummy parent:", dummyParent.id);
    return dummyParent.id;
  }
  // Verify parent exists
  const parent = await prisma.parent.findUnique({ where: { id: parentId } });
  if (!parent) {
    const dummyParent = await prisma.parent.create({
      data: {
        id: parentId,
        username: `parent-${Date.now()}`,
        password: await hashPassword("dummy123"),
        name: "Dummy",
        surname: "Parent",
        phone: "0000000000",
        address: "Auto-created",
      },
    });
    console.log("✅ Auto-created missing parent:", dummyParent.id);
    return dummyParent.id;
  }
  return parentId;
}

async function ensureClassExists(classId?: number | string | null): Promise<number | null> {
  if (!classId || classId === "" || classId === 0) {
    // Create a dummy class
    const dummyGrade = await ensureGradeExists(null);
    const dummyClass = await prisma.class.create({
      data: {
        name: `Dummy Class ${Date.now()}`,
        capacity: 30,
        gradeId: dummyGrade || 1,
      },
    });
    console.log("✅ Auto-created dummy class:", dummyClass.id);
    return dummyClass.id;
  }
  const parsedId = safeInt(classId);
  if (!parsedId) return null;
  
  const classItem = await prisma.class.findUnique({ where: { id: parsedId } });
  if (!classItem) {
    const dummyGrade = await ensureGradeExists(null);
    const dummyClass = await prisma.class.create({
      data: {
        id: parsedId,
        name: `Dummy Class ${Date.now()}`,
        capacity: 30,
        gradeId: dummyGrade || 1,
      },
    });
    console.log("✅ Auto-created missing class:", dummyClass.id);
    return dummyClass.id;
  }
  return parsedId;
}

async function ensureGradeExists(gradeId?: number | string | null): Promise<number | null> {
  if (!gradeId || gradeId === "" || gradeId === 0) {
    // Create a dummy grade
    const dummyGrade = await prisma.grade.create({
      data: {
        level: 1,
      },
    });
    console.log("✅ Auto-created dummy grade:", dummyGrade.id);
    return dummyGrade.id;
  }
  const parsedId = safeInt(gradeId);
  if (!parsedId) return null;
  
  const grade = await prisma.grade.findUnique({ where: { id: parsedId } });
  if (!grade) {
    const dummyGrade = await prisma.grade.create({
      data: {
        id: parsedId,
        level: parsedId,
      },
    });
    console.log("✅ Auto-created missing grade:", dummyGrade.id);
    return dummyGrade.id;
  }
  return parsedId;
}

// GET - Read all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
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
        class: {
          select: { id: true, name: true },
        },
        grade: {
          select: { id: true, level: true },
        },
        parent: {
          select: { id: true, name: true, surname: true },
        },
        attendances: {
          where: {
            date: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        results: {
          select: {
            score: true,
          },
        },
        _count: {
          select: {
            attendances: true,
            results: true,
            fees: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate performance for each student
    const studentsWithPerformance = students.map((student) => {
      const totalAttendance = student.attendances.length;
      const presentDays = student.attendances.filter((a) => a.present).length;
      const attendancePercentage =
        totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0;

      const totalMarks = student.results.reduce((sum, r) => sum + (r.score || 0), 0);
      const averageMarks =
        student.results.length > 0 ? Math.round(totalMarks / student.results.length) : 0;

      // Calculate performance
      const attendanceWeight = 0.4;
      const marksWeight = 0.6;
      const combinedScore =
        attendancePercentage * attendanceWeight + averageMarks * marksWeight;
      
      let performance: "Excellent" | "Good" | "Average" | "At Risk" = "Average";
      if (combinedScore >= 85 && attendancePercentage >= 90 && averageMarks >= 85) {
        performance = "Excellent";
      } else if (combinedScore >= 75 && attendancePercentage >= 80 && averageMarks >= 75) {
        performance = "Good";
      } else if (combinedScore >= 60 && attendancePercentage >= 70 && averageMarks >= 60) {
        performance = "Average";
      } else {
        performance = "At Risk";
      }

      const { attendances, results, ...studentWithoutExtra } = student;
      return {
        ...studentWithoutExtra,
        attendancePercentage,
        averageMarks,
        performance,
      };
    });

    return NextResponse.json(studentsWithPerformance);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST - Create student
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
      parentId,
      classId,
      gradeId,
    } = body;

    // Validate required fields
    if (!username || !password || !name || !surname) {
      const missing = [];
      if (!username) missing.push("username");
      if (!password) missing.push("password");
      if (!name) missing.push("name");
      if (!surname) missing.push("surname");
      
      return NextResponse.json(
        { error: `Required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Coerce to strings for Prisma
    const finalParentId = parentId ? String(parentId) : (await ensureParentExists(null));
    const finalClassId = classId ? (typeof classId === 'string' ? parseInt(classId, 10) : classId) : (await ensureClassExists(null));
    const finalGradeId = gradeId ? (typeof gradeId === 'string' ? parseInt(gradeId, 10) : gradeId) : (await ensureGradeExists(null));
    
    console.log('📤 [API] Creating student with:', {
      parentId: finalParentId,
      classId: finalClassId,
      gradeId: finalGradeId,
      types: {
        parentId: typeof finalParentId,
        classId: typeof finalClassId,
        gradeId: typeof finalGradeId,
      }
    });

    const hashedPassword = await hashPassword(password);
    const id = randomUUID();

    const student = await prisma.student.create({
      data: {
        id,
        username,
        password: hashedPassword,
        name,
        surname,
        email: safeString(email) || null,
        phone: safeString(phone) || null,
        address: safeString(address) || null,
        img: safeString(img) || null,
        bloodType: safeString(bloodType) || "O+",
        sex: (sex === "FEMALE" ? UserSex.FEMALE : UserSex.MALE) || UserSex.MALE,
        birthday: birthday ? new Date(birthday) : new Date(),
        parentId: finalParentId,
        classId: finalClassId,
        gradeId: finalGradeId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        class: {
          select: { id: true, name: true },
        },
        grade: {
          select: { id: true, level: true },
        },
        parent: {
          select: { id: true, name: true, surname: true },
        },
        createdAt: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
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
      { error: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
