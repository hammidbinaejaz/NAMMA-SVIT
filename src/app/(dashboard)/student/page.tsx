import Hero from "@/components/Hero";
import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import WidgetCard from "@/components/WidgetCard";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const StudentPage = async () => {
  const session = await getSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: session.id } },
    },
  });

  const className = classItem[0]?.name || "N/A";

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Hero */}
      <Hero />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule - Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <WidgetCard
            title={`Schedule (${className})`}
            iconName="Calendar"
            className="h-full"
          >
                        <div className="h-[500px]">
                          {classItem[0]?.id ? (
                            <BigCalendarContainer type="classId" id={classItem[0].id} />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No schedule available</div>
                          )}
                        </div>
          </WidgetCard>
        </div>

        {/* Right Column - Events and Announcements */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <WidgetCard
            title="Upcoming Events"
            iconName="Calendar"
            viewAllHref="/list/events"
          >
            <div className="h-[250px]">
              <EventCalendarContainer searchParams={{}} />
            </div>
          </WidgetCard>

          <WidgetCard
            title="Announcements"
            iconName="Bell"
            viewAllHref="/list/announcements"
          >
            <Announcements />
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
