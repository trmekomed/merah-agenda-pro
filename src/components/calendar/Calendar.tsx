
import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { fetchNationalHolidays } from '@/utils/holidaysUtils';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useActivities } from '@/hooks/use-activities';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Date[]>([]);
  const { allActivities: activities, isLoading } = useActivities();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const holidayDates = await fetchNationalHolidays();
        setHolidays(holidayDates);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };

    fetchHolidays();
  }, []);

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
  };

  return (
    <div className={cn(
      "bg-dark-600 rounded-xl shadow-lg",
      isMobile ? "p-2" : "p-4"
    )}>
      <CalendarHeader 
        currentMonth={currentMonth} 
        onMonthChange={setCurrentMonth} 
        onTodayClick={handleTodayClick}
      />
      <CalendarDays />
      <CalendarCells 
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        activities={activities}
        holidays={holidays}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Calendar;
