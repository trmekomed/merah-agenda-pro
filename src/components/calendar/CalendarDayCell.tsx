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
}) => {
  return (
    <div
      onClick={() => onClick?.(date)}
      className={clsx(
        "relative w-full h-full flex flex-col items-center justify-center text-sm rounded-md transition-all",
        isSelected && "bg-red-600 text-white",
        !isSelected && isToday && "border-2 border-red-600 text-red-600",
        isHoliday || isWeekend ? "text-red-500" : "text-white",
        "hover:bg-red-800/40 cursor-pointer"
      )}
    >
      {/** Multi-day background */}
      {(isMultiDayStart || isMultiDayMid || isMultiDayEnd) && (
        <div
          className={clsx(
            "absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 bg-red-600/30 z-0",
            isMultiDayStart && "rounded-l-md",
            isMultiDayEnd && "rounded-r-md"
          )}
        />
      )}

      <span className="relative z-10">{date.getDate()}</span>

      {/** Dots below date */}
      {activityLabels.length > 0 && (
        <div className="absolute bottom-0 flex gap-0.5 mt-0.5 z-10">
          {activityLabels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              className={clsx(
                "w-1.5 h-1.5 rounded-full",
                roColorMap[label]
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
