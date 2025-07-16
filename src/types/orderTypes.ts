export interface IUser {
    _id: string;
    fullName: string;
    email: string;
}

export interface IItem {
    _id: string;
    title: string;
}


export interface IOrderWithPopulated {
    _id: string;
    userId: IUser;
    itemId: IItem;
    type: 'Course' | 'SubscriptionPlan';
    title: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    paymentIntentId?: string;
    paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderStats {
    total: number;
    paid: number;
    pending: number;
    failed: number;
    totalRevenue: number;
}