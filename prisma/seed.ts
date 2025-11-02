import { Day, PrismaClient, UserSex } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash default password for all users
  const defaultPassword = await bcrypt.hash("svit123", 10);

  // ADMIN - One admin as requested
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin",
      password: await bcrypt.hash("svit123", 10),
    },
  });

  console.log("✅ Created admin user (admin / svit123)");

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER - Two faculty as requested
  const facultyNames = [
    { name: "Dr. Rajesh", surname: "Kumar" },
    { name: "Prof. Priya", surname: "Sharma" },
  ];

  for (let i = 0; i < 2; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i + 1}`,
        username: `faculty${i + 1}`,
        password: defaultPassword,
        name: facultyNames[i].name,
        surname: facultyNames[i].surname,
        email: `faculty${i + 1}@svit.edu`,
        phone: `987654321${i}`,
        address: `SVIT Campus, Bangalore`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 35)),
      },
    });
  }

  console.log("✅ Created 2 faculty members");

  // LESSON
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${(i % 15) + 1}`, 
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        password: defaultPassword,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }

  // STUDENT - Three students as requested
  const studentNames = [
    { name: "Arjun", surname: "Reddy" },
    { name: "Meera", surname: "Patel" },
    { name: "Vikram", surname: "Singh" },
  ];

  // Get first parent and class for students
  const firstParent = await prisma.parent.findFirst();
  const firstClass = await prisma.class.findFirst();
  const firstGrade = await prisma.grade.findFirst();

  if (!firstParent || !firstClass || !firstGrade) {
    throw new Error("Parent, Class, or Grade not found. Please seed them first.");
  }

  for (let i = 0; i < 3; i++) {
    await prisma.student.create({
      data: {
        id: `student${i + 1}`,
        username: `student${i + 1}`,
        password: defaultPassword,
        name: studentNames[i].name,
        surname: studentNames[i].surname,
        email: `student${i + 1}@svit.edu`,
        phone: `987654321${i + 1}`,
        address: `Student Address ${i + 1}`,
        bloodType: "O+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: firstParent.id,
        gradeId: firstGrade.id,
        classId: firstClass.id,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
      },
    });
  }

  console.log("✅ Created 3 students");

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90, 
        studentId: `student${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`, 
        description: `Description for Event ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT - Two announcements as requested
  await prisma.announcement.create({
    data: {
      title: "Welcome to NAMMA SVIT ERP Portal",
      description: "We are excited to launch our new ERP system. All students and faculty can now access their dashboards using their credentials.",
      date: new Date(),
      classId: null, // All classes
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Mid-Semester Examinations Schedule",
      description: "Mid-semester examinations will commence from next week. Please check your schedules and prepare accordingly.",
      date: new Date(),
      classId: firstClass?.id || null,
    },
  });

  console.log("✅ Created 2 announcements");
  console.log("✅ Seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log("  - 1 Admin (username: admin, password: svit123)");
  console.log("  - 2 Faculty members");
  console.log("  - 3 Students");
  console.log("  - 2 Announcements");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
