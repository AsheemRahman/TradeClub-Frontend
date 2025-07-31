export interface AvailabilitySlot {
    _id?: string
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

export interface IDashboardStats {
    totalStudents: number;
    totalSessions: number;
    totalEarnings: number;
    averageRating?: number;
    pendingMessages?: number;
    upcomingSessions: number;
    completionRate: number;
    monthlyGrowth: number;
}

export interface ISessionData {
    date: string;
    sessions: number;
    students: number;
}