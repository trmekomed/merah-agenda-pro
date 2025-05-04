import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

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
  
  // Format date for display
  const formattedDate = format(date, "dd MMMM yyyy", { locale: id });
  const formattedTime = format(date, "HH:mm");
  
  // Format time for time input
  const formatTimeForInput = (date: Date) => {
    return format(date, "HH:mm");
  };
  
  // Handle calendar date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Keep the time from the current date
      newDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setDate(newDate);
    }
  };
  
  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(date);
    const [hours, minutes] = e.target.value.split(':').map(Number);
    
    newDate.setHours(hours, minutes, 0, 0);
    setDate(newDate);
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-white">{label}</Label>}
      
      <div className="grid grid-cols-2 gap-2">
        {/* Date Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left bg-dark-600 border-dark-500 hover:bg-dark-500",
                isMobile ? "text-xs px-2" : "text-sm"
              )}
            >
              <CalendarIcon className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-dark-700 border-dark-500" 
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {/* Time Input */}
        <div className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
            <Clock className={cn("mr-1", isMobile ? "h-3 w-3" : "h-4 w-4")} />
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
