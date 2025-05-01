
import { format, isToday, parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { Activity } from '@/types/activity';

// Format date to display day name and date
export const formatDayAndDate = (date: Date): string => {
  return format(date, 'EEEE, d MMMM yyyy', { locale: id });
};

// Format date to display month and year for calendar header
export const formatMonthAndYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: id });
};

// Format time to display hours and minutes
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

// Check if a date is today
export const checkIsToday = (date: Date): boolean => {
  return isToday(date);
};

// Get activities for a specific day
export const getActivitiesForDay = (activities: Activity[], date: Date): Activity[] => {
  return activities.filter((activity) => {
    const startDate = parseISO(activity.start_time);
    return isSameDay(startDate, date);
  });
};

// Calculate activity duration in minutes
export const calculateDurationInMinutes = (start: string, end: string): number => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60);
};

// Format duration as hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} menit`;
  } else if (mins === 0) {
    return `${hours} jam`;
  } else {
    return `${hours} jam ${mins} menit`;
  }
};

// Get day number in month (1-31)
export const getDayOfMonth = (date: Date): number => {
  return date.getDate();
};

// Check if a date has any activities
export const hasActivities = (activities: Activity[], date: Date): boolean => {
  return getActivitiesForDay(activities, date).length > 0;
};
