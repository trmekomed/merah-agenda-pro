
import { format, addMonths, subMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onTodayClick: () => void;
}

const CalendarHeader = ({ currentMonth, onMonthChange, onTodayClick }: CalendarHeaderProps) => {
  const prevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const today = new Date();
  const isCurrentMonth = isSameMonth(today, currentMonth);

  return (
    <div className="flex justify-between items-center mb-6 px-2 text-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={prevMonth}
        className="text-white hover:text-merah-500 hover:bg-dark-600 transition-colors duration-200"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <h2 className="text-xl font-semibold uppercase tracking-wider text-white">
        {format(currentMonth, 'MMMM yyyy', { locale: id })}
      </h2>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onTodayClick}
          className={cn(
            "text-white border-merah-500 hover:bg-merah-500/20",
            isCurrentMonth && "bg-merah-500/20"
          )}
        >
          Hari Ini
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="text-white hover:text-merah-500 hover:bg-dark-600 transition-colors duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
