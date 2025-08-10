
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

export interface IUserProfile {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
}

export type UserMinimal = {
    _id: string;
    fullName: string;
    profilePicture?: string;
    role: "User" | "Expert";
    lastMessage?: string;
    unreadCount?: number;
    updatedAt: string;
};

export interface Message {
    _id: string;
    message: string;
    createdAt: string;
    senderId: string;
    receiverId: string;
    imageUrl?: string;
    isDeleted?: boolean;
}

export interface SessionData {
    tutorId: string;
    studentId: string;
    startTime: Date;
    duration: number;
    roomId: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}


export interface SessionInfo {
    _id: string
    studentName?: string;
    tutorName?: string;
    startTime: Date;
    duration: number;
    status: string;
    roomId?: string;
}


// export interface NotificationType {
//     _id: string;
//     content: string;
//     createdAt: string;
//     isRead: boolean;
//     receiverId: string;
//     updatedAt: string;
//     __v: number;
// }

// export interface review {
//     courseId: string;
//     userId: string;
//     rating: number;
//     review: string;
// }

// export interface ReviewEdit {
//     rating: number;
//     review: string;
// }