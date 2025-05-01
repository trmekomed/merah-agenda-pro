
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { TimePickerDemo } from "./time-picker";
import { Button } from "./button";
import { id } from 'date-fns/locale';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  className?: string;
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(date);

  // Update the parent component's state when the selected date changes
  React.useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate, setDate]);

  // Update internal state if external date changes
  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Preserve the time from the current selectedDate
      const updatedDate = new Date(newDate);
      updatedDate.setHours(selectedDate.getHours());
      updatedDate.setMinutes(selectedDate.getMinutes());
      updatedDate.setSeconds(0);
      updatedDate.setMilliseconds(0);
      setSelectedDate(updatedDate);
    }
  };

  // Handle time change separately to maintain the selected date
  const handleTimeChange = (timeDate: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(timeDate.getHours());
    newDate.setMinutes(timeDate.getMinutes());
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    setSelectedDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedDate, "PPpp", { locale: id })}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-dark-600 border-dark-500" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-dark-500">
          <div className="flex items-center justify-center mb-2">
            <Clock className="mr-2 h-4 w-4 text-merah-500" />
            <span className="text-sm font-medium text-white">Pilih waktu</span>
          </div>
          <div className="time-picker-wrapper" onClick={(e) => e.stopPropagation()}>
            <TimePickerDemo
              setDate={handleTimeChange}
              date={selectedDate}
              className="justify-center"
            />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className="border-t border-dark-500 p-3"
          classNames={{
            day_today: "bg-merah-500/20 text-merah-500 font-bold",
            day_selected: "bg-merah-700 text-white hover:bg-merah-800",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
