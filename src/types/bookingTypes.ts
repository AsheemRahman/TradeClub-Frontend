// Types
export interface IExpert {
    id: string;
    fullName: string;
    profilePicture?: string;
    isActive: boolean,
    isVerified: string;
    experience_level: string;
    year_of_experience: number;
    markets_Traded: string;
    trading_style: string;
    bio: string;
    state: string;
    country: string;
    hourlyRate: number;
    rating?: number;
    reviews?: number;
    createdAt?:Date,
    updatedAt?:Date,
}

export interface IExpertAvailability {
    _id: string;
    expertId: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
    price: number;
    availabilityId?: string;
}

export interface DaySchedule {
    date: string;
    dayName: string;
    slots: TimeSlot[];
}