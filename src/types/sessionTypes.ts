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

export interface ISessionFilters {
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

// Types
interface IUser {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
}

interface IExpert {
    _id: string;
    name: string;
}

export interface IAvailability {
    _id: string;
    startTime: string;
    endTime: string;
    date: Date,
}

export interface ISession {
    _id: string;
    userId: IUser;
    expertId: IExpert;
    availabilityId: IAvailability;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// Types
interface Expert {
    _id: string;
    fullName: string;
    email: string;
    specialization: string;
    profilePicture?: string;
    bio?: string;
    rating?: number;
}

interface ExpertAvailability {
    _id: string;
    startTime: string;
    endTime: string;
    date: string;
}

export interface typeSession {
    _id: string;
    userId: string;
    expertId: Expert;
    availabilityId: ExpertAvailability;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed' | 'canceled';
    bookedAt: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
    updatedAt: string;
}