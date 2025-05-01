
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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Update the parent component's state when the selected date changes
  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPpp", { locale: id }) : <span>Pilih tanggal dan waktu</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-dark-600 border-dark-500">
        <div className="p-4 border-b border-dark-500">
          <div className="flex items-center justify-center mb-2">
            <Clock className="mr-2 h-4 w-4 text-merah-500" />
            <span className="text-sm font-medium text-white">Pilih waktu</span>
          </div>
          <TimePickerDemo
            setDate={setSelectedDate}
            date={selectedDate || date}
          />
        </div>
        <Calendar
          mode="single"
          selected={selectedDate || date}
          onSelect={setSelectedDate}
          initialFocus
          className="border-t border-dark-500 p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
