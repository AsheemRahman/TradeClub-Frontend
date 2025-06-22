
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
    checkBox: boolean;
}

export type UpdateProfilePayload = {
    id: string;
    fullName: string;
    phoneNumber: string;
    newPassword?: string;
    profilePicture : string;
}