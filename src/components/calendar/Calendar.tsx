
import { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';
import { fetchNationalHolidays } from '@/utils/holidaysUtils';

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
      const holidayDates = await fetchNationalHolidays();
      setHolidays(holidayDates);
    };

    fetchActivities();
    fetchHolidays();
  }, []);

  return (
    <div className="bg-dark-600 rounded-xl p-4 shadow-lg">
      <CalendarHeader 
        currentMonth={currentMonth} 
        onMonthChange={setCurrentMonth} 
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
