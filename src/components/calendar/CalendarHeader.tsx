
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { id } from 'date-fns/locale';

interface CalendarHeaderProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const CalendarHeader = ({ currentMonth, onMonthChange }: CalendarHeaderProps) => {
  const prevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex justify-between items-center mb-6 px-2 text-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={prevMonth}
        className="text-white hover:text-merah-500 hover:bg-dark-600"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-semibold uppercase tracking-wider text-white">
        {format(currentMonth, 'MMMM yyyy', { locale: id })}
      </h2>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={nextMonth}
        className="text-white hover:text-merah-500 hover:bg-dark-600"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CalendarHeader;
