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
  isWeekend,
  isAfter,
  isBefore,
} from 'date-fns';
import { Activity } from '@/types/activity';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getHolidayInfo } from '@/utils/holidaysUtils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CalendarDayCell } from './CalendarDayCell';

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
  isLoading,
}: CalendarCellsProps) => {
  const [holidayInfo, setHolidayInfo] = useState<Map<string, string>>(new Map());
  const isMobile = useMediaQuery("(max-width: 768px)");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  useEffect(() => {
    setHolidayInfo(getHolidayInfo());
  }, []);

  const getActivityLabelsForDate = (date: Date): ("RO 1" | "RO 2" | "RO 3")[] => {
    const labels = activities
      .filter((a) => isSameDay(parseISO(a.start_time), date))
      .map((a) => a.label)
      .filter((label): label is "RO 1" | "RO 2" | "RO 3" => ["RO 1", "RO 2", "RO 3"].includes(label));
    return Array.from(new Set(labels));
  };

  const isHoliday = (date: Date) => holidays.some(holiday => isSameDay(date, holiday));
  const getHolidayName = (date: Date): string | undefined => holidayInfo.get(format(date, 'yyyy-MM-dd'));

  const isMultiDayStart = (date: Date) =>
    activities.some(a => {
      const start = parseISO(a.start_time);
      const end = parseISO(a.end_time);
      return isSameDay(date, start) && start.toDateString() !== end.toDateString();
    });

  const isMultiDayEnd = (date: Date) =>
    activities.some(a => {
      const start = parseISO(a.start_time);
      const end = parseISO(a.end_time);
      return isSameDay(date, end) && start.toDateString() !== end.toDateString();
    });

  const isMultiDayMid = (date: Date) =>
    activities.some(a => {
      const start = parseISO(a.start_time);
      const end = parseISO(a.end_time);
      return (
        isAfter(date, start) &&
        isBefore(date, end) &&
        !isSameDay(date, start) &&
        !isSameDay(date, end)
      );
    });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isCurrentMonth = isSameMonth(cloneDay, monthStart);
      const holidayName = isHoliday(cloneDay) ? getHolidayName(cloneDay) : undefined;

      const cell = (
        <CalendarDayCell
          key={cloneDay.toString()}
          date={cloneDay}
          isToday={isSameDay(cloneDay, new Date())}
          isSelected={isSameDay(cloneDay, selectedDate)}
          isWeekend={isWeekend(cloneDay)}
          isHoliday={isHoliday(cloneDay)}
          activityLabels={getActivityLabelsForDate(cloneDay)}
          isMultiDayStart={isMultiDayStart(cloneDay)}
          isMultiDayMid={isMultiDayMid(cloneDay)}
          isMultiDayEnd={isMultiDayEnd(cloneDay)}
          onClick={onDateChange}
        />
      );

      days.push(
        <div
          key={cloneDay.toString()}
          className={!isCurrentMonth ? "text-slate-600" : ""}
        >
          {holidayName ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{cell}</TooltipTrigger>
                <TooltipContent side={isMobile ? 'bottom' : 'top'} align="center" className="bg-dark-800 text-white border-dark-600 text-xs">
                  <p>{holidayName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            cell
          )}
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
    return (
      <div className="bg-dark-700 rounded-lg p-2">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-7 mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
              <div key={`${row}-${cell}`} className={isMobile ? "h-10" : "h-12"}>
                <Skeleton className={isMobile ? "w-8 h-8 rounded-full" : "w-10 h-10 rounded-full bg-dark-600"} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return <div className="bg-dark-700 rounded-lg p-2">{rows}</div>;
};

export default CalendarCells;
