import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Placement, PlacementApplication, Student, Prisma } from "@prisma/client";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

type PlacementList = Placement & { 
  applications: (PlacementApplication & { student: Student })[] 
};

const PlacementListPage = async ({
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
      header: "Company",
      accessor: "companyName",
    },
    {
      header: "Job Title",
      accessor: "jobTitle",
      className: "hidden md:table-cell",
    },
    {
      header: "Package",
      accessor: "package",
      className: "hidden lg:table-cell",
    },
    {
      header: "Deadline",
      accessor: "applicationDeadline",
      className: "hidden md:table-cell",
    },
    ...(role === "student"
      ? [
          {
            header: "Status",
            accessor: "status",
            className: "hidden md:table-cell",
          },
        ]
      : []),
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Applications",
            accessor: "applications",
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

  const renderRow = (item: PlacementList) => {
    const userApplication = item.applications.find(
      (app) => app.studentId === currentUserId
    );

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-svitLight transition-colors"
      >
        <td className="flex items-center gap-4 p-4">
          <div className="flex flex-col">
            <h3 className="font-semibold text-svitPrimary">{item.companyName}</h3>
            <p className="text-xs text-gray-500">{item.location || "Location not specified"}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.jobTitle}</td>
        <td className="hidden lg:table-cell">
          {item.package ? `₹${item.package.toLocaleString()} LPA` : "Not specified"}
        </td>
        <td className="hidden md:table-cell">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(item.applicationDeadline)}
        </td>
        {role === "student" && (
          <td className="hidden md:table-cell">
            {userApplication ? (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userApplication.status === "SELECTED"
                    ? "bg-green-100 text-green-700"
                    : userApplication.status === "SHORTLISTED"
                    ? "bg-blue-100 text-blue-700"
                    : userApplication.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {userApplication.status}
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Not Applied
              </span>
            )}
          </td>
        )}
        {(role === "admin" || role === "teacher") && (
          <td className="hidden lg:table-cell">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-svitAccentLight text-svitAccentDark">
              {item.applications.length} Application{item.applications.length !== 1 ? "s" : ""}
            </span>
          </td>
        )}
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormContainer table="placement" type="update" data={item} />
                <FormContainer table="placement" type="delete" id={item.id} />
              </>
            )}
            {role === "student" && !userApplication && (
              <FormContainer table="placement" type="apply" data={item} />
            )}
            {role === "student" && userApplication && (
              <span className="text-xs text-gray-500">Applied</span>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PlacementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { companyName: { contains: value, mode: "insensitive" } },
              { jobTitle: { contains: value, mode: "insensitive" } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // For students, show all placements (they can filter by their applications in the UI)
  // For admin/teacher, show all placements

  const [data, count] = await prisma.$transaction([
    prisma.placement.findMany({
      where: query,
      include: {
        applications: {
          include: {
            student: true,
          },
        },
      },
      orderBy: {
        postedDate: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.placement.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-svitPrimary">
          Placement Cell
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
            {role === "admin" && (
              <FormContainer table="placement" type="create" />
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

export default PlacementListPage;

