
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

// New interface for the provided holiday format
interface HolidayData {
  [date: string]: {
    summary: string;
  } | { author: string; link: string; updated: string };
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

    // Add the hardcoded 2025 holidays
    const hardcodedHolidays2025 = getHardcodedHolidays2025();
    holidays.push(...hardcodedHolidays2025);

    return holidays;
  } catch (error) {
    console.error('Error fetching national holidays:', error);
    return getHardcodedHolidays2025(); // Fallback to hardcoded holidays if API fails
  }
};

// Function to get hardcoded 2025 holidays
function getHardcodedHolidays2025(): Date[] {
  const holidays2025: HolidayData = {
    "2025-01-01": {"summary": "Hari Tahun Baru"}, 
    "2025-01-27": {"summary": "Isra Mikraj Nabi Muhammad"}, 
    "2025-01-28": {"summary": "Cuti Bersama Tahun Baru Imlek"}, 
    "2025-01-29": {"summary": "Tahun Baru Imlek"}, 
    "2025-03-28": {"summary": "Cuti Bersama Hari Suci Nyepi (Tahun Baru Saka)"}, 
    "2025-03-29": {"summary": "Hari Suci Nyepi (Tahun Baru Saka)"}, 
    "2025-03-31": {"summary": "Hari Idul Fitri"}, 
    "2025-04-01": {"summary": "Hari Idul Fitri"}, 
    "2025-04-02": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-03": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-04": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-07": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-18": {"summary": "Wafat Isa Almasih"}, 
    "2025-04-20": {"summary": "Hari Paskah"}, 
    "2025-05-01": {"summary": "Hari Buruh Internasional / Pekerja"}, 
    "2025-05-12": {"summary": "Hari Raya Waisak"}, 
    "2025-05-13": {"summary": "Cuti Bersama Waisak"}, 
    "2025-05-29": {"summary": "Kenaikan Isa Al Masih"}, 
    "2025-05-30": {"summary": "Cuti Bersama Kenaikan Isa Al Masih"}, 
    "2025-06-01": {"summary": "Hari Lahir Pancasila"}, 
    "2025-06-06": {"summary": "Idul Adha (Lebaran Haji) (belum pasti)"}, 
    "2025-06-09": {"summary": "Idul Adha (Lebaran Haji)"}, 
    "2025-06-27": {"summary": "Satu Muharam / Tahun Baru Hijriah (belum pasti)"}, 
    "2025-08-17": {"summary": "Hari Proklamasi Kemerdekaan R.I."}, 
    "2025-09-05": {"summary": "Maulid Nabi Muhammad (belum pasti)"}, 
    "2025-12-25": {"summary": "Hari Raya Natal"}, 
    "2025-12-26": {"summary": "Cuti Bersama Natal (Hari Tinju)"}
  };

  const holidayDates: Date[] = [];
  
  Object.keys(holidays2025).forEach(dateStr => {
    if (dateStr !== "info") {
      holidayDates.push(new Date(dateStr));
    }
  });
  
  return holidayDates;
}

// Export holiday data with descriptions for potential tooltip usage
export const getHolidayInfo = (): Map<string, string> => {
  const holidays2025: HolidayData = {
    "2025-01-01": {"summary": "Hari Tahun Baru"}, 
    "2025-01-27": {"summary": "Isra Mikraj Nabi Muhammad"}, 
    "2025-01-28": {"summary": "Cuti Bersama Tahun Baru Imlek"}, 
    "2025-01-29": {"summary": "Tahun Baru Imlek"}, 
    "2025-03-28": {"summary": "Cuti Bersama Hari Suci Nyepi (Tahun Baru Saka)"}, 
    "2025-03-29": {"summary": "Hari Suci Nyepi (Tahun Baru Saka)"}, 
    "2025-03-31": {"summary": "Hari Idul Fitri"}, 
    "2025-04-01": {"summary": "Hari Idul Fitri"}, 
    "2025-04-02": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-03": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-04": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-07": {"summary": "Cuti Bersama Idul Fitri"}, 
    "2025-04-18": {"summary": "Wafat Isa Almasih"}, 
    "2025-04-20": {"summary": "Hari Paskah"}, 
    "2025-05-01": {"summary": "Hari Buruh Internasional / Pekerja"}, 
    "2025-05-12": {"summary": "Hari Raya Waisak"}, 
    "2025-05-13": {"summary": "Cuti Bersama Waisak"}, 
    "2025-05-29": {"summary": "Kenaikan Isa Al Masih"}, 
    "2025-05-30": {"summary": "Cuti Bersama Kenaikan Isa Al Masih"}, 
    "2025-06-01": {"summary": "Hari Lahir Pancasila"}, 
    "2025-06-06": {"summary": "Idul Adha (Lebaran Haji) (belum pasti)"}, 
    "2025-06-09": {"summary": "Idul Adha (Lebaran Haji)"}, 
    "2025-06-27": {"summary": "Satu Muharam / Tahun Baru Hijriah (belum pasti)"}, 
    "2025-08-17": {"summary": "Hari Proklamasi Kemerdekaan R.I."}, 
    "2025-09-05": {"summary": "Maulid Nabi Muhammad (belum pasti)"}, 
    "2025-12-25": {"summary": "Hari Raya Natal"}, 
    "2025-12-26": {"summary": "Cuti Bersama Natal (Hari Tinju)"}
  };

  const holidayInfo = new Map<string, string>();
  
  Object.entries(holidays2025).forEach(([dateStr, data]) => {
    if (dateStr !== "info" && "summary" in data) {
      holidayInfo.set(dateStr, data.summary);
    }
  });
  
  return holidayInfo;
}
