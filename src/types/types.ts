export interface TokenPayload {
    email: string;
    role: string;
    iat: number;
    exp: number;
}


export type loginType = {
    email: string,
    password: string
}


export type UserType = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    isActive?: boolean;
    isVerified?: "Approved" | "pending" | "Declined";
    createdAt: string;
}


export type RegisterFormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}


export type IExpert = {
    fullName: string;
    email: string;
    phone_number?: string;
    isVerified?: "Approved" | "Pending" | "Declined";
    isActive?: boolean;
    profilePicture?: string;
    date_of_birth?: string;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
}