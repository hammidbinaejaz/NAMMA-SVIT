-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "bloodType" DROP NOT NULL,
ALTER COLUMN "parentId" DROP NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL,
ALTER COLUMN "gradeId" DROP NOT NULL,
ALTER COLUMN "birthday" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "bloodType" DROP NOT NULL,
ALTER COLUMN "birthday" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
