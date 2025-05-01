// src/components/calendar/CalendarDayCell.tsx

import React from "react";
import clsx from "clsx";

type ActivityLabel = "RO 1" | "RO 2" | "RO 3";

interface CalendarDayCellProps {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isHoliday?: boolean;
  activityLabels?: ActivityLabel[];
  isMultiDayStart?: boolean;
  isMultiDayMid?: boolean;
  isMultiDayEnd?: boolean;
  onClick?: (date: Date) => void;
  isCurrentMonth?: boolean;
}

const roColorMap: Record<ActivityLabel, string> = {
  "RO 1": "bg-blue-500",
  "RO 2": "bg-green-500",
  "RO 3": "bg-orange-500",
};

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  isToday,
  isSelected,
  isWeekend,
  isHoliday,
  activityLabels = [],
  isMultiDayStart,
  isMultiDayMid,
  isMultiDayEnd,
  onClick,
  isCurrentMonth = true,
}) => {
  return (
    <div
      onClick={() => onClick?.(date)}
      className={clsx(
        "relative w-full h-full flex flex-col items-center justify-center text-sm transition-all",
        isHoliday || isWeekend ? "text-red-500" : "text-white",
        !isCurrentMonth && "text-slate-600/60", // fade for outside-month dates
        "cursor-pointer hover:bg-red-900/10"
      )}
    >
      {(isMultiDayStart || isMultiDayMid || isMultiDayEnd) && (
        <div
          className={clsx(
            "absolute top-1/2 left-0 right-0 h-5 -translate-y-1/2 bg-red-600/30 z-0", // slightly taller
            isMultiDayStart && "rounded-l-md",
            isMultiDayEnd && "rounded-r-md"
          )}
        />
      )}

      <div
        className={clsx(
          "relative z-10 flex items-center justify-center transition-all duration-150",
          "w-7 h-7", // exact match to text
          "text-sm rounded-full",
          isSelected && "bg-red-600 text-white",
          isToday && !isSelected && "border-2 border-red-600 text-red-600"
        )}
      >
        {date.getDate()}
      </div>

      {activityLabels.length > 0 && (
        <div className="absolute bottom-0 flex gap-0.5 mt-0.5 z-10">
          {activityLabels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              className={clsx("w-1.5 h-1.5 rounded-full", roColorMap[label])}
            />
          ))}
        </div>
      )}
    </div>
  );
};
