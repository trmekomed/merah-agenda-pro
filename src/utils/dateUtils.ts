
import { 
  format, 
  isToday, 
  parseISO, 
  isWithinInterval, 
  isSameDay, 
  startOfDay,
  endOfDay 
} from 'date-fns';
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

// Get activities for a specific day (including multi-day events)
export const getActivitiesForDay = (activities: Activity[], date: Date): Activity[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return activities.filter((activity) => {
    const startDate = parseISO(activity.start_time);
    const endDate = parseISO(activity.end_time);

    // Check if the activity is on this specific day (single-day event)
    if (isSameDay(startDate, date)) {
      return true;
    }

    // Check if the activity spans multiple days and includes this day
    if (!isSameDay(startDate, endDate)) {
      return isWithinInterval(dayStart, { start: startDate, end: endDate }) || 
             isWithinInterval(dayEnd, { start: startDate, end: endDate }) ||
             (startDate <= dayStart && endDate >= dayEnd);
    }

    return false;
  });
};

// Calculate activity duration in minutes
export const calculateDurationInMinutes = (start: string, end: string): number => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  return Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60));
};

// Format duration as hours and minutes
export const formatDuration = (minutes: number): string => {
  if (minutes < 0) return "0 menit";
  
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = Math.floor(minutes % 60);
  
  const parts = [];
  
  if (days > 0) {
    parts.push(`${days} hari`);
  }
  
  if (hours > 0) {
    parts.push(`${hours} jam`);
  }
  
  if (mins > 0) {
    parts.push(`${mins} menit`);
  }
  
  if (parts.length === 0) {
    return "0 menit";
  }
  
  return parts.join(' ');
};

// Get day number in month (1-31)
export const getDayOfMonth = (date: Date): number => {
  return date.getDate();
};

// Check if a date has any activities
export const hasActivities = (activities: Activity[], date: Date): boolean => {
  return getActivitiesForDay(activities, date).length > 0;
};

// Check if an activity is multi-day event
export const isMultiDayEvent = (activity: Activity): boolean => {
  const startDate = parseISO(activity.start_time);
  const endDate = parseISO(activity.end_time);
  return !isSameDay(startDate, endDate);
};

// Format date range for multi-day events
export const formatDateRange = (start: string, end: string): string => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  
  if (isSameDay(startDate, endDate)) {
    return format(startDate, 'd MMMM yyyy', { locale: id });
  }
  
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${format(startDate, 'd')}–${format(endDate, 'd MMMM yyyy', { locale: id })}`;
  }
  
  return `${format(startDate, 'd MMMM')} – ${format(endDate, 'd MMMM yyyy', { locale: id })}`;
};
