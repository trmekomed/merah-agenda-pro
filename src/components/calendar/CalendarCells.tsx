
import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  isWithinInterval,
  parseISO,
  isWeekend
} from 'date-fns';
import { Activity } from '@/types/activity';
import { hasActivities } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHolidayInfo } from '@/utils/holidaysUtils';

interface CalendarCellsProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  activities: Activity[];
  holidays: Date[];
  isLoading: boolean;
}

const CalendarCells = ({ 
  currentMonth, 
  selectedDate, 
  onDateChange, 
  activities,
  holidays,
  isLoading
}: CalendarCellsProps) => {
  const [holidayInfo, setHolidayInfo] = useState<Map<string, string>>(new Map());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday as start of week
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  useEffect(() => {
    setHolidayInfo(getHolidayInfo());
  }, []);

  const rows = [];
  let days = [];
  let day = startDate;

  const handleDayClick = (day: Date) => {
    onDateChange(day);
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date) => {
    return holidays.some(holiday => isSameDay(date, holiday));
  };

  // Get holiday name for a specific date
  const getHolidayName = (date: Date): string | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidayInfo.get(dateStr);
  };

  // Check if a date is within any multi-day event
  const isWithinMultiDayEvent = (date: Date) => {
    return activities.some(activity => {
      const start = parseISO(activity.start_time);
      const end = parseISO(activity.end_time);
      
      // Check if it spans multiple days
      if (start.toDateString() !== end.toDateString()) {
        return isWithinInterval(date, { start, end });
      }
      return false;
    });
  };
  
  // Check if date has any activities (single or multi-day)
  const hasActivitiesForDate = (date: Date) => {
    return activities.some(activity => {
      const start = parseISO(activity.start_time);
      const end = parseISO(activity.end_time);
      
      // For single day events
      if (start.toDateString() === end.toDateString()) {
        return isSameDay(date, start);
      }
      // For multi-day events
      return isWithinInterval(date, { start, end });
    });
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const formattedDate = format(cloneDay, 'd');
      
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = isSameDay(day, selectedDate);
      const hasEvent = hasActivitiesForDate(cloneDay);
      const isMultiDayEvent = isWithinMultiDayEvent(cloneDay);
      const isHolidayDay = isHoliday(cloneDay);
      const holidayName = isHolidayDay ? getHolidayName(cloneDay) : undefined;
      const isWeekendDay = isWeekend(cloneDay); // Check if it's weekend
      const isToday = isSameDay(cloneDay, new Date());

      const dayElement = (
        <div
          key={day.toString()}
          className={cn(
            "h-12 relative flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-dark-600/50 active:bg-dark-500/70",
            !isCurrentMonth && "text-slate-600",
            (isHolidayDay || isWeekendDay) && isCurrentMonth && "text-merah-500",
            isMultiDayEvent && isCurrentMonth && !isSelected && "bg-merah-700/20",
          )}
          onClick={() => handleDayClick(cloneDay)}
        >
          <div 
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full relative transition-transform duration-200 hover:scale-105",
              isSelected && "bg-merah-700 text-white",
              isToday && !isSelected && "border-2 border-merah-500"
            )}
          >
            {formattedDate}
            {hasEvent && !isSelected && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-merah-700 rounded-full"></span>
            )}
          </div>
        </div>
      );

      if (isHolidayDay && holidayName) {
        days.push(
          <TooltipProvider key={day.toString()}>
            <Tooltip>
              <TooltipTrigger asChild>
                {dayElement}
              </TooltipTrigger>
              <TooltipContent className="bg-dark-800 text-white border-dark-600">
                <p>{holidayName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        days.push(dayElement);
      }
      
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 mb-2">
        {days}
      </div>
    );
    days = [];
  }

  if (isLoading) {
    return <div className="bg-dark-700 rounded-lg p-2">
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="grid grid-cols-7 mb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
            <div key={`${row}-${cell}`} className="h-12 flex items-center justify-center">
              <Skeleton className="w-10 h-10 rounded-full bg-dark-600" />
            </div>
          ))}
        </div>
      ))}
    </div>;
  }

  return <div className="bg-dark-700 rounded-lg p-2">{rows}</div>;
};

export default CalendarCells;
