import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Feedback, Student, Teacher, Admin, Prisma } from "@prisma/client";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

type FeedbackList = Feedback & {
  student?: Student;
  teacher?: Teacher;
  admin?: Admin;
};

const FeedbackListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const session = await getSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  const role = session.role;
  const currentUserId = session.id;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Category",
      accessor: "category",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "createdAt",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Submitted By",
            accessor: "submittedBy",
            className: "hidden lg:table-cell",
          },
        ]
      : []),
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: FeedbackList) => {
    const submittedBy =
      item.student
        ? `${item.student.name} ${item.student.surname} (Student)`
        : item.teacher
        ? `${item.teacher.name} ${item.teacher.surname} (Faculty)`
        : item.admin
        ? `${item.admin.username} (Admin)`
        : "Unknown";

    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      REVIEWED: "bg-blue-100 text-blue-700",
      RESOLVED: "bg-green-100 text-green-700",
      CLOSED: "bg-gray-100 text-gray-700",
    };

    const categoryColors = {
      ACADEMIC: "bg-purple-100 text-purple-700",
      ADMINISTRATIVE: "bg-indigo-100 text-indigo-700",
      FACILITY: "bg-orange-100 text-orange-700",
      GENERAL: "bg-gray-100 text-gray-700",
      COMPLAINT: "bg-red-100 text-red-700",
      SUGGESTION: "bg-teal-100 text-teal-700",
    };

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-svitLight transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold text-svitPrimary">{item.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              categoryColors[item.category as keyof typeof categoryColors]
            }`}
          >
            {item.category}
          </span>
        </td>
        <td className="hidden md:table-cell">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[item.status as keyof typeof statusColors]
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="hidden lg:table-cell">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(item.createdAt)}
        </td>
        {role === "admin" && (
          <td className="hidden lg:table-cell text-sm text-gray-600">
            {submittedBy}
          </td>
        )}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer table="feedback" type="update" data={item} />
                <FormContainer table="feedback" type="view" data={item} />
              </>
            )}
            {(role === "student" || role === "teacher") &&
              item.studentId === currentUserId &&
              item.status !== "CLOSED" && (
                <FormContainer table="feedback" type="view" data={item} />
              )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.FeedbackWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { title: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ];
            break;
          case "category":
            query.category = value as any;
            break;
          case "status":
            query.status = value as any;
            break;
          default:
            break;
        }
      }
    }
  }

  // Role-based filtering
  if (role === "student") {
    query.studentId = currentUserId!;
  } else if (role === "teacher") {
    query.teacherId = currentUserId!;
  }
  // Admin sees all feedback

  const [data, count] = await prisma.$transaction([
    prisma.feedback.findMany({
      where: query,
      include: {
        student: true,
        teacher: true,
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.feedback.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-svitPrimary">
          Feedback & Suggestions
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-svitAccentLight">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-svitAccentLight">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "student" || role === "teacher") && (
              <FormContainer table="feedback" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default FeedbackListPage;

