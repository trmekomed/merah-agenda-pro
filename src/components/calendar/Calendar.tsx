
import { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarDays from './CalendarDays';
import CalendarCells from './CalendarCells';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/services/activityService';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [holidays, setHolidays] = useState<Date[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();

    // In the future, we'll fetch real holidays from an API
    // For now, let's add some dummy holidays
    const dummyHolidays = [
      new Date(2025, 0, 1),  // New Year
      new Date(2025, 4, 1),  // Labor Day
      new Date(2025, 7, 17), // Independence Day
    ];
    setHolidays(dummyHolidays);
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
      />
    </div>
  );
};

export default Calendar;
