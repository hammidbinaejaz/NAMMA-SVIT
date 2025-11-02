"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarClient = dynamic(() => Promise.resolve(BigCalendar), { ssr: false });

export default function BigCalendarContainer({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number | null | undefined;
}) {
  if (!id) {
    return <div className="h-[800px] bg-white/5 rounded-lg flex items-center justify-center text-gray-400">No schedule available</div>;
  }
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lessons?${type}=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.name,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
        }));
        setEvents(adjustScheduleToCurrentWeek(formatted));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, id]);

  if (loading) {
    return <div className="h-[800px] bg-white/5 rounded-lg animate-pulse" />;
  }

  return <BigCalendarClient events={events} />;
}
