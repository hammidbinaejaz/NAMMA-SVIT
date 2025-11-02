"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Client-only calendar to avoid hydration issues
const ClientCalendar = dynamic(() => Promise.resolve(Calendar), { ssr: false });

export default function EventCalendar() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="w-full">
      <ClientCalendar
        onChange={(value) => setDate(value as Date)}
        value={date}
        className="w-full border-none"
      />
    </div>
  );
}
