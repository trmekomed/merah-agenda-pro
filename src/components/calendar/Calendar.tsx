
import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';
import { fetchNationalHolidays } from '@/utils/holidaysUtils';
import { cn } from '@/lib/utils';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchHolidays = async () => {
      try {
        const holidayDates = await fetchNationalHolidays();
        setHolidays(holidayDates);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };

    fetchActivities();
    fetchHolidays();
  }, []);

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
  };

  return (
    <div className="bg-dark-600 rounded-xl p-4 shadow-lg">
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
