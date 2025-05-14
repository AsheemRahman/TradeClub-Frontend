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
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    createdAt: string;
}