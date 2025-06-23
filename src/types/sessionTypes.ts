export interface AvailabilitySlot {
    _id?:string
    expertId: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface CalendarDay {
    date: Date;
    dayName: string;
    dayNumber: number;
    availableSlots: number;
    slots: AvailabilitySlot[];
}