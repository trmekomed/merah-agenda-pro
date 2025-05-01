
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}

export function TimePickerDemo({
  date,
  setDate,
  className,
}: TimePickerProps) {
  // Function to set the time from hours and minutes
  function setTime(hours: number, minutes: number) {
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0); // Reset seconds to avoid confusion
    setDate(newDate);
  }

  // Handle hours change
  function handleHoursChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hours = parseInt(e.target.value, 10);
    if (isNaN(hours) || hours < 0 || hours > 23) return;
    setTime(hours, date.getMinutes());
  }

  // Handle minutes change
  function handleMinutesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const minutes = parseInt(e.target.value, 10);
    if (isNaN(minutes) || minutes < 0 || minutes > 59) return;
    setTime(date.getHours(), minutes);
  }

  // Format number to always have 2 digits
  function formatTimeUnit(value: number) {
    return value.toString().padStart(2, "0");
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        className="w-16 bg-dark-700 border-dark-500 text-white text-center"
        value={formatTimeUnit(date.getHours())}
        onChange={handleHoursChange}
        type="number"
        min="0"
        max="23"
      />
      <span className="text-white text-xl">:</span>
      <Input
        className="w-16 bg-dark-700 border-dark-500 text-white text-center"
        value={formatTimeUnit(date.getMinutes())}
        onChange={handleMinutesChange}
        type="number"
        min="0"
        max="59"
      />
    </div>
  );
}
