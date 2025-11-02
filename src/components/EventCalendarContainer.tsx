"use client";

import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

export default function EventCalendarContainer({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) {
  const { date } = searchParams;
  return (
    <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
      <EventCalendar />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold text-white">Events</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
}
