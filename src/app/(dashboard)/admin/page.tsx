import Hero from "@/components/Hero";
import KpiCard from "@/components/KpiCard";
import WidgetCard from "@/components/WidgetCard";
import SummaryCards from "@/components/SummaryCards";
import Announcements from "@/components/Announcements";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import SmartAnalytics from "@/components/SmartAnalytics";
import NotificationsCard from "@/components/NotificationsCard";
import QRAttendance from "@/components/QRAttendance";
import TopStudentsList from "@/components/TopStudentsList";
import AttendanceTrendChart from "@/components/AttendanceTrendChart";

export const dynamic = 'force-dynamic';

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-8">
      {/* Hero */}
      <Hero />

      {/* KPI Cards */}
      <SummaryCards />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Attendance Trend */}
        <WidgetCard
          title="Attendance Trend"
          iconName="TrendingUp"
          viewAllHref="/list/attendance"
          className="h-[400px]"
        >
          <AttendanceTrendChart />
        </WidgetCard>

        {/* Right: Top Students */}
        <WidgetCard
          title="Top Students"
          iconName="Bell"
          className="h-[400px]"
        >
          <TopStudentsList />
        </WidgetCard>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements */}
        <WidgetCard
          title="Announcements"
          iconName="Bell"
          viewAllHref="/list/announcements"
          className="lg:col-span-1"
        >
          <Announcements />
        </WidgetCard>

        {/* Events Calendar */}
        <WidgetCard
          title="Upcoming Events"
          iconName="Calendar"
          viewAllHref="/list/events"
          className="lg:col-span-1"
        >
          <div className="h-[300px]">
            <EventCalendarContainer searchParams={searchParams} />
          </div>
        </WidgetCard>

        {/* Notifications */}
        <WidgetCard
          title="Notifications"
          iconName="Bell"
          viewAllHref="/admin/notifications"
          className="lg:col-span-1"
        >
          <NotificationsCard />
        </WidgetCard>
      </div>
    </div>
  );
};

export default AdminPage;
