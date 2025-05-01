
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
  isWeekend
} from 'date-fns';
import { Activity } from '@/types/activity';
import { hasActivities } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday as start of week
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

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

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const formattedDate = format(cloneDay, 'd');
      
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = isSameDay(day, selectedDate);
      const hasEvent = hasActivities(activities, cloneDay);
      const isHolidayDay = isHoliday(cloneDay);
      const isWeekendDay = isWeekend(cloneDay); // Check if it's weekend

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "h-12 relative flex items-center justify-center cursor-pointer",
            !isCurrentMonth && "text-slate-600",
            (isHolidayDay || isWeekendDay) && isCurrentMonth && "text-merah-500",
          )}
          onClick={() => handleDayClick(cloneDay)}
        >
          <div 
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full relative",
              isSelected && "bg-merah-700 text-white"
            )}
          >
            {formattedDate}
            {hasEvent && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-merah-700 rounded-full"></span>}
          </div>
        </div>
      );
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
