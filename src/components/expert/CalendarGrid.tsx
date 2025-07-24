import React from 'react';
import { ChevronLeft, ChevronRight, } from 'lucide-react';
import { CalendarDay } from '@/types/sessionTypes';


// Calendar Grid Component
interface CalendarGridProps {
    currentDate: Date;
    calendarDays: CalendarDay[];
    selectedDate: Date | null;
    onDateSelect: (day: CalendarDay) => void;
    onNavigateMonth: (direction: 'prev' | 'next') => void;
    onMonthChange: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, calendarDays, selectedDate, onDateSelect, onNavigateMonth, onMonthChange }) => {

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const futureMonths: string[] = [];

    for (let year = currentYear; year <= currentYear + 1; year++) {
        const startMonth = year === currentYear ? currentMonth : 0;
        for (let month = startMonth; month < 12; month++) {
            futureMonths.push(`${monthNames[month]} ${year}`);
        }
    }

    const getSlotColor = (slotCount: number) => {
        if (slotCount === 0) return 'bg-red-500';
        if (slotCount <= 3) return 'bg-orange-500';
        if (slotCount <= 6) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <select className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-medium border-2 border-orange-500 focus:outline-none focus:border-orange-400"
                        value={`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        onChange={(e) => {
                            const [monthName, year] = e.target.value.split(' ');
                            const monthIndex = monthNames.indexOf(monthName);
                            const newDate = new Date(parseInt(year), monthIndex, 1);
                            onMonthChange(newDate);
                        }}
                    >
                        {futureMonths.map((monthYear) => (
                            <option key={monthYear} className="bg-white text-black">
                                {monthYear}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => onNavigateMonth('prev')}
                        className="bg-orange-600 hover:bg-orange-700 p-3 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => onNavigateMonth('next')}
                        className="bg-orange-600 hover:bg-orange-700 p-3 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
                {calendarDays.map((day, index) => (
                    <button key={index} onClick={() => onDateSelect(day)} className={` bg-gray-800 rounded-lg p-4 border-2 transition-all duration-200 hover:bg-gray-700
                            ${selectedDate?.getDate() === day.dayNumber ? 'border-orange-500 bg-gray-700' : 'border-gray-700'}`}
                    >
                        <div className="text-center">
                            <div className="text-lg font-medium mb-1">{day.dayName}</div>
                            <div className="text-2xl font-bold mb-3">{day.dayNumber.toString().padStart(2, '0')}</div>
                            <div className="flex items-center justify-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getSlotColor(day.availableSlots)}`}></div>
                                <span className="text-sm text-gray-300">{day.availableSlots} Slots</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};