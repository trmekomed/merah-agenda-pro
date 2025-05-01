
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const mobileDays = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

const CalendarDays = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const displayDays = isMobile ? mobileDays : days;

  return (
    <div className={cn(
      "grid grid-cols-7 mb-2 bg-dark-800 rounded-md",
      isMobile ? "text-xs p-1" : "text-sm p-2"
    )}>
      {displayDays.map((day, index) => (
        <div
          key={day}
          className={cn(
            "flex items-center justify-center text-center font-medium",
            isMobile ? "h-6" : "h-8",
            (index === 5 || index === 6) && "text-merah-500"
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarDays;
