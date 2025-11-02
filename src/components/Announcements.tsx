import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const Announcements = async () => {
  const session = await getSession();
  const role = session?.role || "";
  const userId = session?.id || "";

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const data = await prisma.announcement.findMany({
    take: 5,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && role && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="space-y-3">
      {data.map((announcement) => (
        <div
          key={announcement.id}
          className="p-3 bg-background rounded-lg border-l-4 border-primary hover:bg-card transition-colors"
        >
          <div className="flex items-start justify-between mb-1">
            <h2 className="font-medium text-textPrimary text-sm flex-1">{announcement.title}</h2>
            <span className="text-xs text-textSecondary bg-card rounded px-2 py-1 whitespace-nowrap ml-2">
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
              }).format(announcement.date)}
            </span>
          </div>
          <p className="text-sm text-textSecondary mt-1 line-clamp-2">{announcement.description}</p>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-textSecondary text-center py-4">No announcements</p>
      )}
    </div>
  );
};

export default Announcements;
