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
    rating?: number;
    reviews?: number;
    createdAt?: Date,
    updatedAt?: Date,
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
    availabilityId?: string;
}

export interface DaySchedule {
    date: string;
    dayName: string;
    slots: TimeSlot[];
}

export interface BookingDetails {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export interface BookingData {
    expertId: string;
    date: string;
    timeSlot: string;
    availabilityId: string;
    clientDetails: BookingDetails;
}