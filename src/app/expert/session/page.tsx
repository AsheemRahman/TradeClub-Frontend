"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AvailabilitySlot, CalendarDay } from '@/types/sessionTypes';

import { CalendarGrid } from '@/components/expert/CalendarGrid';
import { TimeSlotManager } from '@/components/expert/TimeSlotManager';
import { addSlot, deleteSlot, editSlot, slotAvailability } from '@/app/service/expert/sessionApi';
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ExpertScheduleManager = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
    const [viewHalf, setViewHalf] = useState<'first' | 'second'>('first');
    const [selectedDateSlots, setSelectedDateSlots] = useState<AvailabilitySlot[]>([]);


    const fetchSlots = useCallback(async () => {
        try {
            const data = await slotAvailability();
            const slots = data.slots || [];
            setAvailableSlots(slots);
            return slots;
        } catch (error) {
            console.error("Failed to fetch slots", error);
            return [];
        }
    }, []);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const generateCalendarDays = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const start = viewHalf === 'first' ? 1 : 17;
        const end = viewHalf === 'first' ? 16 : lastDay.getDate();
        const days: CalendarDay[] = [];
        for (let i = start; i <= end; i++) {
            const date = new Date(year, month, i);
            const dateStr = getDateString(date);
            const slots = availableSlots.filter(slot => slot.date === dateStr);
            days.push({
                date,
                dayName: dayNames[date.getDay()],
                dayNumber: i,
                availableSlots: slots.length,
                slots,
            });
        }
        setCalendarDays(days);
    }, [currentDate, viewHalf, availableSlots]);

    useEffect(() => {
        generateCalendarDays();
    }, [generateCalendarDays]);

    // Helper function to get date string without timezone issues
    const getDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (selectedDate) {
            const dateStr = getDateString(selectedDate);
            const daySlots = availableSlots.filter(slot => { return slot.date === dateStr;});
            setSelectedDateSlots(daySlots);
        } else {
            setSelectedDateSlots([]);
        }
    }, [selectedDate, availableSlots]);

    const handleDateSelect = (day: CalendarDay) => {
        setSelectedDate(day.date);
    };

    const handleNavigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            if (viewHalf === 'second') {
                setViewHalf('first');
            } else {
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
                setViewHalf('second');
            }
        } else {
            if (viewHalf === 'first') {
                setViewHalf('second');
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
                setViewHalf('first');
            }
        }
        setSelectedDate(null);
    };

    const handleMonthChange = (date: Date) => {
        setCurrentDate(date);
        setSelectedDate(null);
    };

    const handleSlotsUpdate = async (updatedSlots: AvailabilitySlot[]) => {
        if (!selectedDate) return;
        const dateStr = getDateString(selectedDate);
        const previousSlots = availableSlots.filter(slot => slot.date === dateStr);
        // Find new slots (those without _id or with temporary _id)
        const newSlots = updatedSlots.filter(
            slot => !slot._id || slot._id.startsWith('temp-') || !previousSlots.some(prev => prev._id === slot._id)
        );
        // Find edited slots
        const editedSlots = updatedSlots.filter(slot => {
            const prev = previousSlots.find(prev => prev._id === slot._id);
            return prev && !slot._id?.startsWith('temp-') && (prev.startTime !== slot.startTime || prev.endTime !== slot.endTime);
        });
        // Find deleted slots
        const deletedSlots = previousSlots.filter(
            prev => !updatedSlots.some(slot => slot._id === prev._id)
        );
        try {
            // Execute API calls
            const apiPromises = [];
            // Add new slots
            for (const slot of newSlots) {
                const { ...slotData } = slot;
                apiPromises.push(addSlot(slotData));
            }
            // Edit existing slots
            for (const slot of editedSlots) {
                apiPromises.push(editSlot(slot));
            }
            // Delete slots
            for (const slot of deletedSlots) {
                if (slot._id) {
                    apiPromises.push(deleteSlot(slot._id));
                }
            }
            await Promise.all(apiPromises);
            await fetchSlots();
        } catch (error) {
            console.error("Slot update failed:", error);
            // Optionally, you could show an error message to the user here
        }
    };

    return (
        <div className="min-h-screen text-white px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Manage Your Schedule</h1>

                <CalendarGrid
                    currentDate={currentDate}
                    calendarDays={calendarDays}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onNavigateMonth={handleNavigateMonth}
                    onMonthChange={handleMonthChange}
                />

                <TimeSlotManager
                    selectedDate={selectedDate}
                    availableSlots={selectedDateSlots}
                    onSlotsUpdate={handleSlotsUpdate}
                />
            </div>
        </div>
    );
};

export default ExpertScheduleManager;