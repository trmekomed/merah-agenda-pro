
interface Holiday {
  holiday_name: string;
  holiday_date: string;
  is_national_holiday: boolean;
}

interface HolidaysResponse {
  [year: string]: {
    [date: string]: Holiday;
  };
}

export const fetchNationalHolidays = async (): Promise<Date[]> => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/guangrei/APIHariLibur_V2/main/holidays.json'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch holidays data');
    }

    const data = await response.json() as HolidaysResponse;
    const holidays: Date[] = [];

    // Process the holidays data
    Object.entries(data).forEach(([year, yearData]) => {
      Object.entries(yearData).forEach(([, holidayInfo]) => {
        if (holidayInfo.is_national_holiday) {
          const [day, month, yearPart] = holidayInfo.holiday_date.split('-');
          holidays.push(new Date(parseInt(yearPart), parseInt(month) - 1, parseInt(day)));
        }
      });
    });

    return holidays;
  } catch (error) {
    console.error('Error fetching national holidays:', error);
    return [];
  }
};
