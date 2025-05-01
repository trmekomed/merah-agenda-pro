
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const CalendarDays = () => {
  // For Indonesian days - starting with Monday
  const indonesianDays = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  
  return (
    <div className="grid grid-cols-7 mb-2">
      {indonesianDays.map((day, index) => (
        <div
          key={index}
          className="text-center text-sm py-2 font-medium text-slate-400"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarDays;
