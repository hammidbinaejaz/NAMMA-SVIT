"use client";

import dynamic from "next/dynamic";
import { Calendar as BigCalendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

interface BigCalendarProps {
  events: CalendarEvent[];
}

// Client-only calendar to avoid hydration issues
const ClientBigCalendar = dynamic(
  () => Promise.resolve(({ events }: BigCalendarProps) => (
    <div className="h-[800px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["week", "day"]}
        defaultView="week"
      />
    </div>
  )),
  { ssr: false }
);

export default function BigCalendarComponent({ events }: BigCalendarProps) {
  return <ClientBigCalendar events={events} />;
}
