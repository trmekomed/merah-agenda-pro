
import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface SimpleDateTimeInputProps {
  date: Date;
  setDate: (date: Date) => void;
  label?: string;
  className?: string;
}

export function SimpleDateTimeInput({
  date,
  setDate,
  label,
  className,
}: SimpleDateTimeInputProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Format date for date input
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };
  
  // Format time for time input
  const formatTimeForInput = (date: Date) => {
    return format(date, "HH:mm");
  };
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(date);
    const [year, month, day] = e.target.value.split('-').map(Number);
    
    newDate.setFullYear(year);
    newDate.setMonth(month - 1); // Month is 0-indexed
    newDate.setDate(day);
    
    setDate(newDate);
  };
  
  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(date);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    setDate(newDate);
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-white">{label}</Label>}
      
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
            <CalendarIcon className={cn("mr-1", isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
          </div>
          <Input
            type="date"
            value={formatDateForInput(date)}
            onChange={handleDateChange}
            className={cn(
              "bg-dark-600 border-dark-500 text-white pl-8",
              isMobile ? "text-xs" : "text-sm"
            )}
          />
        </div>
        
        <div className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
            <Clock className={cn("mr-1", isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
          </div>
          <Input
            type="time"
            value={formatTimeForInput(date)}
            onChange={handleTimeChange}
            className={cn(
              "bg-dark-600 border-dark-500 text-white pl-8",
              isMobile ? "text-xs" : "text-sm"
            )}
          />
        </div>
      </div>
      
      <div className="text-xs text-slate-400">
        {format(date, "EEEE, d MMMM yyyy • HH:mm", { locale: id })}
      </div>
    </div>
  );
}
