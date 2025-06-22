"use client"
import { CalendarGrid } from '@/components/expert/CalendarGrid';
import { TimeSlotManager } from '@/components/expert/TimeSlotManager';
import React, { useState, useEffect } from 'react';


interface AvailabilitySlot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface CalendarDay {
    date: Date;
    dayName: string;
    dayNumber: number;
    availableSlots: number;
    slots: AvailabilitySlot[];
}


const ExpertScheduleManager = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    // Mock data - replace with actual API calls
    const [mockAvailability, setMockAvailability] = useState<AvailabilitySlot[]>([
        { _id: '1', date: '2025-05-01', startTime: '07:30', endTime: '08:30', isBooked: false },
        { _id: '2', date: '2025-05-01', startTime: '08:30', endTime: '09:30', isBooked: false },
        { _id: '3', date: '2025-05-01', startTime: '09:00', endTime: '10:00', isBooked: false },
        { _id: '4', date: '2025-05-03', startTime: '07:30', endTime: '08:30', isBooked: false },
        { _id: '5', date: '2025-05-03', startTime: '08:30', endTime: '09:30', isBooked: false },
        { _id: '6', date: '2025-05-05', startTime: '07:30', endTime: '08:30', isBooked: true },
        { _id: '7', date: '2025-05-05', startTime: '08:30', endTime: '09:30', isBooked: false },
        { _id: '8', date: '2025-05-05', startTime: '09:30', endTime: '10:30', isBooked: false },
    ]);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        generateCalendarDays();
    }, [currentDate, mockAvailability]);

    useEffect(() => {
        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const daySlots = mockAvailability.filter(slot => slot.date === dateStr);
            setAvailableSlots(daySlots);
        }
    }, [selectedDate, mockAvailability]);

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: CalendarDay[] = [];
        for (let i = 0; i < 16; i++) {
            const date = new Date(year, month, firstDay.getDate() + i);
            if (date > lastDay) break;
            const dateStr = date.toISOString().split('T')[0];
            const slots = mockAvailability.filter(slot => slot.date === dateStr);
            days.push({
                date,
                dayName: dayNames[date.getDay()],
                dayNumber: date.getDate(),
                availableSlots: slots.length,
                slots
            });
        }
        setCalendarDays(days);
    };

    const handleDateSelect = (day: CalendarDay) => {
        setSelectedDate(day.date);
    };

    const handleNavigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
        setSelectedDate(null);
    };

    const handleMonthChange = (date: Date) => {
        setCurrentDate(date);
        setSelectedDate(null);
    };

    const handleSlotsUpdate = (updatedSlots: AvailabilitySlot[]) => {
        // Update the specific date's slots in mockAvailability
        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const otherSlots = mockAvailability.filter(slot => slot.date !== dateStr);
            const newMockAvailability = [...otherSlots, ...updatedSlots.filter(slot => slot.date === dateStr)];
            setMockAvailability(newMockAvailability);
        }
    };

    return (
        <div className="min-h-screen  text-white px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold mb-8">Manage Your Schedule</h1>

                {/* Calendar Grid Component */}
                <CalendarGrid currentDate={currentDate} calendarDays={calendarDays} selectedDate={selectedDate}
                    onDateSelect={handleDateSelect} onNavigateMonth={handleNavigateMonth} onMonthChange={handleMonthChange}
                />

                {/* Time Slot Manager Component */}
                <TimeSlotManager selectedDate={selectedDate} availableSlots={availableSlots} onSlotsUpdate={handleSlotsUpdate} />
            </div>
        </div>
    );
};

export default ExpertScheduleManager;