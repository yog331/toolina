
import React, { useState, useEffect, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

type HolidayType = 'Gazetted' | 'Restricted' | 'Bank';
type ViewMode = 'List' | 'Calendar';

interface Holiday {
  date: number; // Day of the month
  name: string;
  day: string;
  type: HolidayType;
}

const HOLIDAY_DATA: Record<number, Record<string, Holiday[]>> = {
  2025: {
    "January": [
      { date: 1, name: "New Year's Day", day: "Wednesday", type: "Restricted" },
      { date: 6, name: "Guru Gobind Singh Jayanti", day: "Monday", type: "Gazetted" },
      { date: 14, name: "Makar Sankranti", day: "Tuesday", type: "Restricted" },
      { date: 26, name: "Republic Day", day: "Sunday", type: "Gazetted" },
    ],
    "February": [
      { date: 26, name: "Maha Shivaratri", day: "Wednesday", type: "Gazetted" },
    ],
    "March": [
      { date: 14, name: "Holi (Dhulandi)", day: "Friday", type: "Gazetted" },
      { date: 30, name: "Rajasthan Day", day: "Sunday", type: "Restricted" },
      { date: 31, name: "Eid-ul-Fitr", day: "Monday", type: "Gazetted" },
    ],
    "April": [
      { date: 6, name: "Ram Navami", day: "Sunday", type: "Gazetted" },
      { date: 10, name: "Mahavir Jayanti", day: "Thursday", type: "Gazetted" },
      { date: 14, name: "Ambedkar Jayanti", day: "Monday", type: "Gazetted" },
      { date: 18, name: "Good Friday", day: "Friday", type: "Gazetted" },
    ],
    "May": [
      { date: 30, name: "Maharana Pratap Jayanti", day: "Friday", type: "Gazetted" }
    ],
    "June": [
      { date: 7, name: "Eid-ul-Zuha (Bakrid)", day: "Saturday", type: "Gazetted" }
    ],
    "July": [
      { date: 6, name: "Muharram", day: "Sunday", type: "Gazetted" }
    ],
    "August": [
      { date: 9, name: "World Tribal Day", day: "Saturday", type: "Gazetted" },
      { date: 15, name: "Independence Day", day: "Friday", type: "Gazetted" },
      { date: 16, name: "Janmashtami", day: "Saturday", type: "Gazetted" },
    ],
    "September": [
      { date: 5, name: "Ramdev Jayanti", day: "Friday", type: "Gazetted" },
      { date: 6, name: "Barawafat", day: "Saturday", type: "Gazetted" }
    ],
    "October": [
      { date: 2, name: "Gandhi Jayanti", day: "Thursday", type: "Gazetted" },
      { date: 20, name: "Diwali", day: "Monday", type: "Gazetted" },
      { date: 21, name: "Govardhan Puja", day: "Tuesday", type: "Gazetted" },
      { date: 22, name: "Bhai Dooj", day: "Wednesday", type: "Gazetted" }
    ],
    "November": [
      { date: 5, name: "Guru Nanak Jayanti", day: "Wednesday", type: "Gazetted" }
    ],
    "December": [
      { date: 25, name: "Christmas Day", day: "Thursday", type: "Gazetted" }
    ]
  },
  2026: {
    "January": [
      { date: 1, name: "Christian New Year", day: "Thursday", type: "Restricted" },
      { date: 13, name: "Lohri", day: "Tuesday", type: "Restricted" },
      { date: 25, name: "Devnarayan Jayanti", day: "Sunday", type: "Gazetted" },
      { date: 26, name: "Gantantra Diwas", day: "Monday", type: "Gazetted" },
      { date: 31, name: "Vishwakarma Jayanti", day: "Saturday", type: "Restricted" },
      { date: 31, name: "Swami Ramcharan Jayanti", day: "Saturday", type: "Restricted" }
    ],
    "February": [
      { date: 1, name: "Guru Ravidas Jayanti", day: "Sunday", type: "Restricted" },
      { date: 3, name: "Shab-e-Barat", day: "Tuesday", type: "Restricted" },
      { date: 12, name: "Maharshi Dayanand Saraswati Jayanti", day: "Thursday", type: "Restricted" },
      { date: 15, name: "Maha Shivaratri", day: "Sunday", type: "Gazetted" },
      { date: 23, name: "Gadge Maharaj Jayanti", day: "Monday", type: "Restricted" }
    ],
    "March": [
      { date: 2, name: "Holika Dahan", day: "Monday", type: "Gazetted" },
      { date: 3, name: "Dhulandi", day: "Tuesday", type: "Gazetted" },
      { date: 20, name: "Cheti Chand", day: "Friday", type: "Gazetted" },
      { date: 20, name: "Jumat-ul-Vida", day: "Friday", type: "Restricted" },
      { date: 21, name: "Id-ul-Fitr (Chand se)", day: "Saturday", type: "Gazetted" },
      { date: 26, name: "Ram Navami", day: "Thursday", type: "Gazetted" },
      { date: 31, name: "Mahavir Jayanti", day: "Tuesday", type: "Gazetted" }
    ],
    "April": [
      { date: 3, name: "Good Friday", day: "Friday", type: "Gazetted" },
      { date: 11, name: "Mahatma Jyotiba Phule Jayanti", day: "Saturday", type: "Gazetted" },
      { date: 14, name: "Dr. Ambedkar Jayanti", day: "Tuesday", type: "Gazetted" },
      { date: 14, name: "Vaisakhi", day: "Tuesday", type: "Restricted" },
      { date: 14, name: "Sain Jayanti", day: "Tuesday", type: "Restricted" },
      { date: 19, name: "Parshuram Jayanti", day: "Sunday", type: "Gazetted" }
    ],
    "May": [
      { date: 1, name: "Buddha Purnima", day: "Friday", type: "Restricted" },
      { date: 28, name: "Id-ul-Zuha", day: "Thursday", type: "Gazetted" }
    ],
    "June": [
      { date: 17, name: "Maharana Pratap Jayanti", day: "Wednesday", type: "Gazetted" },
      { date: 26, name: "Moharram (Tajiya) (Chand se)", day: "Friday", type: "Gazetted" }
    ],
    "July": [
      { date: 29, name: "Guru Purnima", day: "Wednesday", type: "Restricted" }
    ],
    "August": [
      { date: 9, name: "Vishv Adivasi Diwas", day: "Sunday", type: "Gazetted" },
      { date: 15, name: "Swatantrata Diwas", day: "Saturday", type: "Gazetted" },
      { date: 26, name: "Barawafat (Chand se)", day: "Wednesday", type: "Gazetted" },
      { date: 28, name: "Rakshabandhan", day: "Friday", type: "Gazetted" }
    ],
    "September": [
      { date: 3, name: "Thadadi", day: "Thursday", type: "Restricted" },
      { date: 4, name: "Shri Krishna Janmashtami", day: "Friday", type: "Gazetted" },
      { date: 14, name: "Ganesh Chaturthi", day: "Monday", type: "Restricted" },
      { date: 16, name: "Samvatsari", day: "Wednesday", type: "Restricted" },
      { date: 21, name: "Ramdev Jayanti, Teja Dashmi evm Khejarli Shaheed Diwas", day: "Monday", type: "Gazetted" },
      { date: 25, name: "Anant Chaturdashi", day: "Friday", type: "Restricted" }
    ],
    "October": [
      { date: 2, name: "Mahatma Gandhi Jayanti", day: "Friday", type: "Gazetted" },
      { date: 11, name: "Navratra Sthapana evm Maharaja Agrasen Jayanti", day: "Sunday", type: "Gazetted" },
      { date: 19, name: "Durgashtami", day: "Monday", type: "Gazetted" },
      { date: 20, name: "Vijayadashami", day: "Tuesday", type: "Gazetted" },
      { date: 20, name: "Mahanavami", day: "Tuesday", type: "Restricted" },
      { date: 29, name: "Karva Chauth", day: "Thursday", type: "Restricted" }
    ],
    "November": [
      { date: 8, name: "Deepawali", day: "Sunday", type: "Gazetted" },
      { date: 9, name: "Govardhan Puja", day: "Monday", type: "Gazetted" },
      { date: 11, name: "Bhai Dooj", day: "Wednesday", type: "Gazetted" },
      { date: 24, name: "Guru Nanak Jayanti", day: "Tuesday", type: "Gazetted" }
    ],
    "December": [
      { date: 25, name: "Christmas Day", day: "Friday", type: "Gazetted" }
    ]
  },
  2027: {
    "January": [
      { date: 1, name: "New Year's Day", day: "Friday", type: "Restricted" },
      { date: 26, name: "Republic Day", day: "Tuesday", type: "Gazetted" },
    ],
    "March": [
      { date: 10, name: "Eid-ul-Fitr", day: "Wednesday", type: "Gazetted" },
      { date: 24, name: "Holi (Dhulandi)", day: "Wednesday", type: "Gazetted" },
    ],
    "August": [
      { date: 15, name: "Independence Day", day: "Sunday", type: "Gazetted" },
    ]
  }
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

const RajasthanCalendar: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 87 });

    const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [viewMode, setViewMode] = useState<ViewMode>('Calendar');
  const [activeMonth, setActiveMonth] = useState<string>(MONTHS[new Date().getMonth()]);
  const [filter, setFilter] = useState<HolidayType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [employeeType, setEmployeeType] = useState<'Govt' | 'Bank'>('Govt');
  const [showImageModal, setShowImageModal] = useState(false);
  
  const monthScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monthScrollRef.current) {
      const container = monthScrollRef.current;
      const activeElement = container.querySelector('[data-active="true"]') as HTMLElement;
      if (activeElement) {
        const containerWidth = container.offsetWidth;
        const elementOffset = activeElement.offsetLeft - container.offsetLeft;
        const elementWidth = activeElement.offsetWidth;
        const scrollPosition = elementOffset - (containerWidth / 2) + (elementWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [activeMonth]);

  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Toolina//Rajasthan Calendar//EN\n";
    
    Object.entries(currentHolidays).forEach(([monthName, days]: [string, any]) => {
      days.forEach((holiday: any) => {
        const monthIndex = MONTHS.indexOf(monthName);
        const dStr = (n: number) => String(n).padStart(2, '0');
        
        const startDateStr = `${selectedYear}${dStr(monthIndex + 1)}${dStr(holiday.date)}`;
        
        // Date end is exclusive
        const endDate = new Date(selectedYear, monthIndex, holiday.date + 1);
        const endDateStr = `${endDate.getFullYear()}${dStr(endDate.getMonth() + 1)}${dStr(endDate.getDate())}`;

        icsContent += "BEGIN:VEVENT\n";
        icsContent += `DTSTART;VALUE=DATE:${startDateStr}\n`;
        icsContent += `DTEND;VALUE=DATE:${endDateStr}\n`;
        icsContent += `SUMMARY:${holiday.name}\n`;
        icsContent += `DESCRIPTION:${holiday.type} Holiday\n`;
        icsContent += "END:VEVENT\n";
      });
    });
    
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rajasthan_Holidays_${selectedYear}_${employeeType}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const availableYears = [2025, 2026, 2027];

  useEffect(() => {
    setSelectedHoliday(null);
  }, [selectedYear, activeMonth]);

  const extendedHolidays = React.useMemo(() => {
    const base = JSON.parse(JSON.stringify(HOLIDAY_DATA[selectedYear] || {}));
    if (employeeType === 'Bank') {
      const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      MONTHS.forEach(month => {
        if (!base[month]) base[month] = [];
        const monthIndex = MONTHS.indexOf(month);
        const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
        const saturdays = [];
        for (let d = 1; d <= daysInMonth; d++) {
          if (new Date(selectedYear, monthIndex, d).getDay() === 6) saturdays.push(d);
        }
        if (saturdays[1]) base[month].push({ date: saturdays[1], name: '2nd Saturday', day: 'Sat', type: 'Bank' });
        if (saturdays[3]) base[month].push({ date: saturdays[3], name: '4th Saturday', day: 'Sat', type: 'Bank' });
        
        if (month === 'April' && !base[month].find((h: any) => h.date === 1)) {
          const april1Day = WEEK[new Date(selectedYear, monthIndex, 1).getDay()];
          base[month].push({ date: 1, name: 'Bank Annual Closing', day: april1Day, type: 'Bank' });
        }
        base[month] = base[month].sort((a: any, b: any) => a.date - b.date);
      });
    }
    return base;
  }, [selectedYear, employeeType]);

  const currentHolidays = extendedHolidays;

  const getMonthData = (year: number, monthName: string) => {
    const monthIndex = MONTHS.indexOf(monthName);
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const filteredHolidays = Object.entries(currentHolidays).reduce((acc, [month, days]: [string, any[]]) => {
    const matchedDays = days.filter(d => 
      (filter === 'All' || d.type === filter) &&
      (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || month.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (matchedDays.length > 0) acc[month] = matchedDays;
    return acc;
  }, {} as Record<string, Holiday[]>);

  const renderCalendarGrid = (year: number, monthName: string) => {
    const { firstDay, daysInMonth } = getMonthData(year, monthName);
    const blanks = Array(firstDay).fill(null);
    const monthHolidays = currentHolidays[monthName] || [];
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
      <SEO title={`Rajasthan Govt Holiday Calendar ${selectedYear} - Official List | Toolina`} description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Toolina App",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingInfo.rating.toString(),
             "ratingCount": ratingInfo.count.toString()
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`text-[9px] sm:text-[10px] font-black uppercase text-center py-2 sm:py-3 ${d === 'Sun' || d === 'Sat' ? 'text-red-500' : 'text-slate-400'}`}>
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
          </div>
        ))}
        {blanks.map((_, i) => <div key={`blank-${i}`} className="aspect-square"></div>)}
        {daysArray.map(day => {
          const holiday = monthHolidays.find(h => h.date === day);
          const dayOfWeek = new Date(year, MONTHS.indexOf(monthName), day).getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; 
          const isSelected = selectedHoliday?.date === day;

          // Tooltip Position Logic for Edges
          let tooltipPosClass = "left-1/2 -translate-x-1/2";
          let arrowPosClass = "left-1/2 -translate-x-1/2";

          if (dayOfWeek === 0) { // Sunday (Left Edge)
            tooltipPosClass = "left-0 translate-x-0";
            arrowPosClass = "left-4 translate-x-0";
          } else if (dayOfWeek === 6) { // Saturday (Right Edge)
            tooltipPosClass = "right-0 translate-x-0 left-auto";
            arrowPosClass = "right-4 translate-x-0 left-auto";
          }

          let bgClass = "bg-white border-slate-100";
          let textClass = "text-slate-700";

          if (holiday) {
             if (holiday.type === 'Gazetted') {
                 bgClass = "bg-teal-500 border-teal-600 shadow-md";
                 textClass = "text-white";
             } else if (holiday.type === 'Restricted') {
                 bgClass = "bg-amber-400 border-amber-500 shadow-md";
                 textClass = "text-slate-900";
             } else if (holiday.type === 'Bank') {
                 bgClass = "bg-indigo-500 border-indigo-600 shadow-md";
                 textClass = "text-white";
             }
          } else if (isWeekend) {
             bgClass = "bg-red-50/50 border-red-100";
             textClass = "text-red-600";
          }
          
          return (
            <button 
              key={day} 
              onClick={() => holiday && setSelectedHoliday(isSelected ? null : holiday)}
              className={`aspect-square relative rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center transition-all group ${bgClass} ${holiday ? 'cursor-pointer active:scale-90 z-20' : 'cursor-default pointer-events-none'} ${isSelected ? 'ring-2 ring-slate-800 ring-offset-2 z-[40]' : ''}`}
            >
              <span className={`text-xs sm:text-sm md:text-base font-black ${textClass}`}>
                {day}
              </span>
              
              {/* Desktop Hover Info - Fast Look */}
              {holiday && !isSelected && (
                <div className="absolute inset-0 bg-slate-900/90 text-white opacity-0 md:group-hover:opacity-100 flex items-center justify-center p-2 text-center transition-opacity z-10 pointer-events-none rounded-xl sm:rounded-2xl">
                  <span className="text-[9px] md:text-[10px] font-bold leading-tight">{holiday.name}</span>
                </div>
              )}

              {/* Click-based Tooltip - Optimized for Mobile & Precision */}
              {isSelected && holiday && (
                <div className={`absolute bottom-full mb-3 w-40 sm:w-48 md:w-56 z-[100] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 pointer-events-none ${tooltipPosClass}`}>
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-white/10 text-center md:text-left">
                    <p className="font-black text-[10px] sm:text-[11px] leading-tight mb-1">{holiday.name}</p>
                    <p className="text-[8px] sm:text-[9px] font-black text-teal-400 uppercase tracking-widest">
                      {holiday.day} • {holiday.type}
                    </p>
                  </div>
                  <div className={`w-3 h-3 bg-slate-900 rotate-45 absolute -bottom-1.5 border-r border-b border-white/10 ${arrowPosClass}`}></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const getUpcomingLongWeekends = (year: number) => {
    const list: { range: string, reason: string, type: string, days: number }[] = [];
    const holidayData = HOLIDAY_DATA[year];
    if (!holidayData) return list;

    Object.entries(holidayData).forEach(([month, days]) => {
      days.forEach(holiday => {
        if (holiday.type !== 'Gazetted') return;
        
        const monthIndex = MONTHS.indexOf(month);
        const dayOfWeek = new Date(year, monthIndex, holiday.date).getDay(); // 0 is Sun, 6 is Sat

        const formatDate = (dateOffset: number) => {
          const d = new Date(year, monthIndex, holiday.date + dateOffset);
          return `${MONTHS[d.getMonth()].substring(0,3)} ${d.getDate()}`;
        };

        // Check for Monday holidays -> creates Sat, Sun, Mon (3 days)
        if (dayOfWeek === 1) {
          list.push({
            range: `${formatDate(-2)} - ${formatDate(0)}`,
            reason: `${holiday.name} (Mon)`,
            type: holiday.type,
            days: 3
          });
        }
        // Check for Friday holidays -> creates Fri, Sat, Sun (3 days)
        else if (dayOfWeek === 5) {
          list.push({
            range: `${formatDate(0)} - ${formatDate(2)}`,
            reason: `${holiday.name} (Fri)`,
            type: holiday.type,
            days: 3
          });
        }
        // Check for Thursday holidays -> creates Thu, Fri(leave), Sat, Sun (4 days potential)
        else if (dayOfWeek === 4) {
          list.push({
            range: `${formatDate(0)} - ${formatDate(3)}`,
            reason: `Take Fri off after ${holiday.name.split(' ')[0]}`,
            type: holiday.type,
            days: 4
          });
        }
        // Check for Tuesday holidays -> creates Sat, Sun, Mon(leave), Tue (4 days potential)
        else if (dayOfWeek === 2) {
          list.push({
            range: `${formatDate(-3)} - ${formatDate(0)}`,
            reason: `Take Mon off before ${holiday.name.split(' ')[0]}`,
            type: holiday.type,
            days: 4
          });
        }
      });
    });

    // Remove duplicates based on start date
    const uniqueList = list.filter((v, i, a) => a.findIndex(t => (t.range === v.range)) === i);
    
    // Sort chronologically using the first month
    return uniqueList;
  };

  return (
    <article className="max-w-6xl mx-auto space-y-4 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 sm:px-4 print:p-0 print:space-y-4" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      {/* Header Section */}
      <header className="bg-white p-4 sm:p-8 md:p-12 rounded-none sm:rounded-[2.5rem] md:rounded-[3.5rem] border-b sm:border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative print:shadow-none print:border-none print:p-0">
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl print:hidden"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10 w-full mb-8 print:mb-4">
          {/* Title Block */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl shadow-xl shadow-teal-500/30 text-white shrink-0 ring-1 ring-teal-800/10">🗓️</div>
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight">
                Rajasthan Govt <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Calendar</span>
              </h1>
              <p className="text-slate-500 font-medium text-[10px] sm:text-sm mt-1 flex items-center gap-2">
                Official Holiday List <span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-md font-bold text-[10px] border border-teal-100">{selectedYear}</span>
              </p>
            </div>
          </div>
          
          {/* Top Actions: Export & Print */}
          <div className="print:hidden flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <button 
              onClick={handleExportICS}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all shadow-md focus:ring-4 focus:ring-slate-200"
            >
              <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Export ICS
            </button>
          </div>
        </div>

        {/* Global Controls Panel */}
        <div className="print:hidden">
        <div className="print:hidden bg-slate-50/80 p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] border border-slate-200 backdrop-blur-md relative z-10 flex flex-col xl:flex-row gap-2 sm:gap-3 w-full">
            
            {/* Year & Sector Config */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
              {/* Year */}
              <div className="flex bg-white p-1 rounded-xl sm:rounded-3xl border border-slate-200/60 shadow-sm flex-1 sm:max-w-[280px]">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex-1 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all ${selectedYear === year ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Govt/Bank */}
              <div className="flex bg-white p-1 rounded-xl sm:rounded-3xl border border-slate-200/60 shadow-sm flex-1">
                <button 
                  onClick={() => { setEmployeeType('Govt'); setFilter('All'); }} 
                  className={`flex-1 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all ${employeeType === 'Govt' ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${employeeType === 'Govt' ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                    Govt. Standard
                  </div>
                </button>
                <button 
                  onClick={() => setEmployeeType('Bank')} 
                  className={`flex-1 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all ${employeeType === 'Bank' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${employeeType === 'Bank' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                    Bank / RBI
                  </div>
                </button>
              </div>
            </div>

            {/* View Mode Config */}
            <div className="flex bg-white p-1 rounded-xl sm:rounded-3xl border border-slate-200/60 shadow-sm w-full xl:w-72 shrink-0">
              <button 
                onClick={() => setViewMode('Calendar')} 
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all flex justify-center items-center gap-2 ${viewMode === 'Calendar' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Calendar
              </button>
              <button 
                onClick={() => setViewMode('List')} 
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all flex justify-center items-center gap-2 ${viewMode === 'List' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                List View
              </button>
            </div>
        </div>
        </div>

        {/* Month Selector Bar */}
        <div className="print:hidden mt-4 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative z-10">
          {viewMode === 'Calendar' ? (
            <div ref={monthScrollRef} className="lg:col-span-12 flex overflow-x-auto scroll-smooth scrollbar-hide gap-2 pb-1 snap-x snap-mandatory">
              {MONTHS.map(m => (
                <button 
                  key={m} 
                  onClick={() => setActiveMonth(m)}
                  data-active={activeMonth === m}
                  className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest border transition-all shrink-0 snap-start min-w-[100px] text-center ${
                    activeMonth === m ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  {m.substring(0, 3)}
                  <span className="hidden sm:inline">{m.substring(3)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="lg:col-span-12 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Filter holidays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:ring-4 ring-teal-50 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
              <div className="flex gap-2">
                {(['All', 'Gazetted', 'Restricted', 'Bank'] as const).map(type => (employeeType === 'Govt' && type === 'Bank' ? null : 
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`flex-1 md:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all border ${
                      filter === type 
                        ? 'bg-teal-600 text-white border-teal-600 shadow-lg' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main View Area */}
      {viewMode === 'Calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <section className="lg:col-span-8 print:lg:col-span-12 bg-white p-4 sm:p-10 print:p-2 rounded-2xl sm:rounded-[3.5rem] print:rounded-none border border-slate-200 print:border-none shadow-sm animate-in zoom-in duration-500 overflow-visible">
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 mb-6 sm:mb-10">
               <div className="flex justify-between items-start w-full sm:w-auto">
                 <div>
                   <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">{activeMonth}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Rajasthan Official {selectedYear}</p>
                 </div>
                 {/* Mobile Thumbnail */}
                 <button 
                   onClick={() => setShowImageModal(true)}
                   className="print:hidden sm:hidden relative group bg-slate-100 overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 w-[72px] h-[72px] shrink-0 flex items-center justify-center p-0"
                 >
                    <img 
                      src={`/calendars/${selectedYear}/${String(MONTHS.indexOf(activeMonth) + 1).padStart(2, '0')}.jpg`} 
                      alt={`Thumbnail ${activeMonth} ${selectedYear}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 backdrop-blur-[1px]">
                      <svg className="w-4 h-4 text-slate-800 drop-shadow-sm bg-white p-1 rounded-full shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </div>
                 </button>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between w-full sm:w-auto">
                 <div className="flex flex-wrap gap-4">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 bg-teal-500 rounded-full"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gazetted</span></div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-400 rounded-full"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restricted</span></div>
                   {employeeType === 'Bank' && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank</span></div>}
                 </div>
                 {/* Desktop/Tablet Thumbnail */}
                 <button 
                   onClick={() => setShowImageModal(true)}
                   className="print:hidden hidden sm:flex relative group bg-slate-100 overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 w-24 h-24 shrink-0 items-center justify-center p-0"
                 >
                    <img 
                      src={`/calendars/${selectedYear}/${String(MONTHS.indexOf(activeMonth) + 1).padStart(2, '0')}.jpg`} 
                      alt={`Thumbnail ${activeMonth} ${selectedYear}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 backdrop-blur-[1px]">
                      <svg className="w-5 h-5 text-slate-800 drop-shadow-sm bg-white p-1 rounded-full shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </div>
                 </button>
               </div>
             </div>
             {renderCalendarGrid(selectedYear, activeMonth)}
          </section>

          <aside className="lg:col-span-4 space-y-6 print:hidden">
            {/* Holiday List Card - Corrected Styles */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span> This Month's List
               </h3>
               <div className="space-y-4">
                 {(currentHolidays[activeMonth] || []).map((h, i) => (
                   <button 
                    key={i} 
                    onClick={() => setSelectedHoliday(selectedHoliday?.date === h.date ? null : h)}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all ${selectedHoliday?.date === h.date ? 'bg-white/10 border-teal-500/50 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-lg ${h.type === 'Gazetted' ? 'bg-teal-600 text-white' : h.type === 'Restricted' ? 'bg-amber-500 text-slate-900' : 'bg-indigo-500 text-white'}`}>
                       {h.date}
                     </div>
                     <div className="min-w-0">
                       <p className={`font-black text-xs sm:text-sm tracking-tight truncate ${selectedHoliday?.date === h.date ? 'text-teal-400' : 'text-white'}`}>{h.name}</p>
                       <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1">{h.day} • {h.type}</p>
                     </div>
                   </button>
                 ))}
                 {(!currentHolidays[activeMonth] || currentHolidays[activeMonth].length === 0) && (
                   <div className="text-center py-6">
                      <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest italic">No public holidays</p>
                   </div>
                 )}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 flex flex-col max-h-[500px]">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 shrink-0">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Long Weekend Guide
               </h3>
               <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                 {getUpcomingLongWeekends(selectedYear).map((w, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-200 transition-all shrink-0">
                     <div className="min-w-0 mr-3">
                       <p className="text-[11px] font-black text-slate-800 tracking-tight truncate">{w.range}</p>
                       <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter truncate" title={w.reason}>{w.reason}</p>
                     </div>
                     <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex flex-col items-center shrink-0">
                        <span className="text-[10px] font-black text-teal-600 leading-none">{w.days}</span>
                        <span className="text-[7px] font-black text-slate-400 uppercase">Days</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-6 print:gap-4 animate-in fade-in duration-500">
          {Object.entries(filteredHolidays).map(([month, days]) => (
            <section key={month} className="print:break-inside-avoid bg-white rounded-[2.5rem] print:rounded-xl md:rounded-[2.5rem] border border-slate-100 print:border-slate-300 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-teal-100/30 transition-all group border-b-4 border-b-transparent hover:border-b-teal-500 print:border-b-0">
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-display font-black text-slate-800 tracking-tight">{month}</h2>
                <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">{days.length} Events</span>
              </div>
              <div className="divide-y divide-slate-50">
                {days.map((holiday, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl shrink-0 flex flex-col items-center justify-center border shadow-sm ${
                      holiday.type === 'Gazetted' ? 'bg-teal-600 border-teal-700 text-white' : holiday.type === 'Bank' ? 'bg-indigo-500 border-indigo-600 text-white' : 'bg-amber-500 border-amber-600 text-slate-900'
                    }`}>
                      <span className="text-sm font-black leading-none mb-1">{holiday.date}</span>
                      <span className={`text-[8px] font-black uppercase tracking-tighter opacity-70`}>{holiday.day.substring(0, 3)}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-[13px] font-black text-slate-900 leading-tight mb-2 truncate group-hover:text-teal-700 transition-colors">{holiday.name}</h3>
                      <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest border ${
                        holiday.type === 'Gazetted' ? 'bg-teal-50 text-teal-600 border-teal-100' : holiday.type === 'Bank' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {holiday.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {Object.keys(filteredHolidays).length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
               <div className="text-6xl opacity-10 mb-6 grayscale">🧘‍♂️</div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nothing found for your filters</p>
               <button onClick={() => { setSearchTerm(''); setFilter('All'); }} className="mt-4 text-teal-600 font-bold text-xs hover:underline uppercase tracking-widest">Reset View</button>
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-[calc(100vw-2rem)] h-full max-h-[90vh] md:w-[calc(90vh*0.707)] md:max-w-none flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 shrink-0">
               <div>
                 <h3 className="text-xl sm:text-2xl font-black text-slate-900">Official Calendar Image</h3>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{activeMonth} {selectedYear}</p>
               </div>
               <button 
                 onClick={() => setShowImageModal(false)}
                 className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-all shrink-0"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            
            <div className="flex-1 min-h-0 bg-slate-100 rounded-2xl border border-slate-200 relative flex items-center justify-center overflow-hidden p-0">
              <img 
                src={`/calendars/${selectedYear}/${String(MONTHS.indexOf(activeMonth) + 1).padStart(2, '0')}.jpg`} 
                alt={`Rajasthan Govt Calendar ${activeMonth} ${selectedYear}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.error-msg')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-msg text-center p-8';
                    errorDiv.innerHTML = `
                      <div class="text-4xl mb-4">🖼️</div>
                      <p class="text-sm font-bold text-slate-500">Image not found.</p>
                      <p class="text-xs text-slate-400 mt-2 max-w-md mx-auto">Please ensure you have placed the files at: <br/> <code class="bg-slate-200 px-2 py-1 rounded text-slate-700">public/calendars/${selectedYear}/${String(MONTHS.indexOf(activeMonth) + 1).padStart(2, '0')}.jpg</code></p>
                    `;
                    parent.appendChild(errorDiv);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="print:hidden bg-slate-900 rounded-none sm:rounded-[3rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">Official <span className="text-teal-400">Rajasthan GAD</span> Calendar Data</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Authorized holiday schedule as released by the General Administration Department of Rajasthan. Essential for planning official leave, government office visits, and coordinating state-wide activities across 33+ districts.
            </p>
            <div className="flex flex-wrap gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
               <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest">2026 Ready</div>
               <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest">Gazetted List</div>
               <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest">RH Options</div>
            </div>
          </div>
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="text-3xl">🗓️</span> Leave Planning
            </h3>
            <ul className="space-y-6">
              {[
                "Confirm 'Restricted Holidays' with your DDO or Department Head.",
                "Public Gazetted holidays apply to all state corporations.",
                "Bank holidays are separately managed by RBI Rajasthan circle.",
                "Court vacations may follow separate High Court calendars."
              ].map((tip, i) => (
                <li key={i} className="flex gap-4 text-xs sm:text-sm text-slate-400 leading-relaxed group">
                  <span className="text-teal-500 font-black group-hover:scale-150 transition-transform">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">PRECISION SCHEDULING BY TOOLINA AUDIT SYSTEMS</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Rajasthan Calendar"
        howItWorks="This tool uses advanced client-side processing to deliver instant results without sending your data to any external server. Simply input your parameters, and the algorithmic engine processes the data locally in your browser ensuring maximum privacy and speed."
        whyItsUseful="Whether you are a professional or a casual user, this tool saves you significant time by automating complex calculations and data transformations. It eliminates manual errors and provides a structured, easy-to-read output that you can rely on for your daily tasks."
        faqs={[
          { q: "Is my data secure?", a: "Yes, 100% secure. All processing happens entirely within your browser. We do not store or transmit your inputs to any remote servers." },
          { q: "Is this tool free to use?", a: "Absolutely. Toolina provides this utility completely free of charge with no hidden limits or premium paywalls." },
          { q: "Can I use this on mobile?", a: "Yes, the interface is fully responsive and works seamlessly across desktops, tablets, and smartphones." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="rajasthancalendar" 
          defaultRating={4.6} 
          defaultCount={87} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Rajasthan Govt Holiday Calendar" />
      </article>
  );
};

export default RajasthanCalendar;
