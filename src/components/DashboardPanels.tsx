import GlowCard from "./ui/GlowCard";
import Announcements from "./Announcements";
import EventCalendarContainer from "./EventCalendarContainer";
import AttendanceChartContainer from "./AttendanceChartContainer";
import { Calendar, Bell, TrendingUp } from "lucide-react";
import DashboardPanelWrapper from "./DashboardPanelWrapper";

interface DashboardPanelsProps {
  searchParams?: { [keys: string]: string | undefined };
}

export default function DashboardPanels({ searchParams }: DashboardPanelsProps) {
  return (
    <DashboardPanelWrapper>
      {/* Upcoming Events */}
      <>
        <GlowCard className="h-full hover:shadow-[0_0_30px_rgba(229,168,35,0.3)] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-svitAccent/20 rounded-lg">
              <Calendar className="w-5 h-5 text-svitAccent" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Upcoming Events
            </h2>
          </div>
          <div className="h-[400px] overflow-y-auto smooth-scroll">
            <EventCalendarContainer searchParams={searchParams || {}} />
          </div>
        </GlowCard>
      </>

      {/* Announcements */}
      <>
        <GlowCard className="h-full hover:shadow-[0_0_30px_rgba(11,60,125,0.3)] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-svitPrimary/20 rounded-lg">
              <Bell className="w-5 h-5 text-svitPrimary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-['Outfit']">
              Announcements
            </h2>
          </div>
          <div className="h-[400px] overflow-y-auto smooth-scroll">
            <Announcements />
          </div>
        </GlowCard>
      </>

      {/* Attendance Trend */}
      <>
        <GlowCard className="h-full hover:shadow-[0_0_30px_rgba(229,168,35,0.3)] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-svitAccent/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-svitAccent" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-['Outfit']">
              Attendance Trend
            </h2>
          </div>
          <div className="h-[400px]">
            <AttendanceChartContainer />
          </div>
        </GlowCard>
      </>
    </DashboardPanelWrapper>
  );
}

