import prisma from "@/lib/prisma";
import { RefreshCw } from "lucide-react";
import DbViewClient from "@/components/DbViewClient";

export const dynamic = 'force-dynamic';

export default async function DbViewPage() {
  const [students, parents, classes] = await Promise.all([
    prisma.student.findMany({
      take: 50,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        createdAt: true,
        class: { select: { name: true } },
        parent: { select: { name: true, surname: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.parent.findMany({
      take: 50,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.class.findMany({
      take: 50,
      select: {
        id: true,
        name: true,
        capacity: true,
        _count: { select: { students: true } },
      },
      orderBy: { id: "asc" },
    }),
  ]);

  return <DbViewClient initialData={{ students, parents, classes }} />;
}

