"use client";

import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
}

const EventList = ({ dateParam }: { dateParam: string | undefined }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Fetch events from API
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Filter events for the selected date
        const filtered = data.filter((event: Event) => {
          const eventDate = new Date(event.startTime);
          return eventDate >= startOfDay && eventDate <= endOfDay;
        });
        setEvents(filtered);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, [dateParam]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No events scheduled for this date
      </div>
    );
  }

  return (
    <>
      {events.map((event) => {
        const startTime = new Date(event.startTime);
        return (
          <div
            className="p-5 rounded-md border-2 border-white/10 border-t-4 bg-white/5 backdrop-blur-sm odd:border-t-[#FFD24A] even:border-t-blue-500 hover:bg-white/10 transition-colors"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-white">{event.title}</h1>
              <span className="text-gray-400 text-xs">
                {startTime.toLocaleTimeString("en-UK", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-300 text-sm">{event.description}</p>
          </div>
        );
      })}
    </>
  );
};

export default EventList;
