import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function adjustScheduleToCurrentWeek(data: Array<{ title: string; start: Date | string; end: Date | string }>) {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  currentWeekStart.setHours(0, 0, 0, 0);

  return data.map((item) => {
    const start = typeof item.start === 'string' ? new Date(item.start) : item.start;
    const end = typeof item.end === 'string' ? new Date(item.end) : item.end;
    
    // Adjust to current week
    const dayOfWeek = start.getDay();
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + dayOfWeek);
    newStart.setHours(start.getHours(), start.getMinutes(), 0, 0);
    
    const newEnd = new Date(newStart);
    newEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);
    
    return {
      ...item,
      start: newStart,
      end: newEnd,
    };
  });
}
