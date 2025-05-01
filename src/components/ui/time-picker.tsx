
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (isNaN(hours)) return;
    setTime(Math.max(0, Math.min(23, hours)), date.getMinutes());
  }

  // Handle minutes change
  function handleMinutesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const minutes = parseInt(e.target.value, 10);
    if (isNaN(minutes)) return;
    setTime(date.getHours(), Math.max(0, Math.min(59, minutes)));
  }

  // Increment and decrement functions
  function incrementHours(e: React.MouseEvent) {
    e.stopPropagation();
    const newHours = (date.getHours() + 1) % 24;
    setTime(newHours, date.getMinutes());
  }

  function decrementHours(e: React.MouseEvent) {
    e.stopPropagation();
    const newHours = (date.getHours() - 1 + 24) % 24;
    setTime(newHours, date.getMinutes());
  }

  function incrementMinutes(e: React.MouseEvent) {
    e.stopPropagation();
    const newMinutes = (date.getMinutes() + 1) % 60;
    setTime(date.getHours(), newMinutes);
  }

  function decrementMinutes(e: React.MouseEvent) {
    e.stopPropagation();
    const newMinutes = (date.getMinutes() - 1 + 60) % 60;
    setTime(date.getHours(), newMinutes);
  }

  // Format number to always have 2 digits
  function formatTimeUnit(value: number) {
    return value.toString().padStart(2, "0");
  }

  // Prevent propagation for the time picker
  const handleTimePickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      onClick={handleTimePickerClick}
    >
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-merah-500" 
          onClick={incrementHours}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          className="w-16 bg-dark-700 border-dark-500 text-white text-center"
          value={formatTimeUnit(date.getHours())}
          onChange={handleHoursChange}
          type="text"
          aria-label="Hours"
          onClick={(e) => e.stopPropagation()}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-merah-500" 
          onClick={decrementHours}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      
      <span className="text-white text-xl">:</span>
      
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-merah-500" 
          onClick={incrementMinutes}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          className="w-16 bg-dark-700 border-dark-500 text-white text-center"
          value={formatTimeUnit(date.getMinutes())}
          onChange={handleMinutesChange}
          type="text"
          aria-label="Minutes"
          onClick={(e) => e.stopPropagation()}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-merah-500" 
          onClick={decrementMinutes}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
