export interface TokenPayload {
    email: string;
    role: string;
    iat: number;
    exp: number;
}


export type adminloginType = {
    email: string,
    password: string
}


export type UserType = {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    createdAt: string;
}


export type RegisterFormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}