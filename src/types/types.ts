
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
    profilePicture: string;
}

export interface ICoupon {
    _id?: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    usageLimit?: number;
    usedCount?: number;
    expiresAt: string | Date;
    isActive: boolean;
    target: 'all' | 'new_joiners' | 'specific_users' | 'premium_users' | 'first_purchase';
    createdAt?: Date;
}

export interface IOrder {
    _id?: string;
    id?: string;
    userId: string;
    type: 'Course' | 'SubscriptionPlan';
    itemId: string;
    title: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    paymentIntentId?: string;
    paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface GetUserParams {
    search?: string;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
}