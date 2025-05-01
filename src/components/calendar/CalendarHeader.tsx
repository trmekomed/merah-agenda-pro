
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CalendarHeaderProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onTodayClick: () => void;
}

const CalendarHeader = ({ currentMonth, onMonthChange, onTodayClick }: CalendarHeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const prevMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    onMonthChange(date);
  };

  const nextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    onMonthChange(date);
  };

  const formatMonthYear = () => {
    return format(currentMonth, 'MMMM yyyy', { locale: id });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size={isMobile ? "icon-xs" : "icon"}
          onClick={prevMonth}
          className="text-white hover:text-merah-500 hover:bg-dark-500"
        >
          <ChevronLeft className={cn("h-4 w-4", !isMobile && "h-5 w-5")} />
        </Button>
        <Button
          variant="ghost"
          size={isMobile ? "icon-xs" : "icon"}
          onClick={nextMonth}
          className="text-white hover:text-merah-500 hover:bg-dark-500"
        >
          <ChevronRight className={cn("h-4 w-4", !isMobile && "h-5 w-5")} />
        </Button>
      </div>

      <h2 className={cn(
        "text-white font-medium capitalize",
        isMobile ? "text-sm" : "text-lg"
      )}>
        {formatMonthYear()}
      </h2>

      <Button
        variant="outline"
        size={isMobile ? "xs" : "sm"}
        onClick={onTodayClick}
        className="border-merah-500 text-merah-500 hover:bg-merah-500 hover:text-white"
      >
        Hari Ini
      </Button>
    </div>
  );
};

export default CalendarHeader;
