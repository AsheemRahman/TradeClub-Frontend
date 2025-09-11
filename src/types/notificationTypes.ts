export interface NotificationType {
    _id: string;
    title: string;
    message: string;
    type: 'course' | 'consultation' | 'subscription' | 'system' | string;
    priority: 'high' | 'medium' | 'low';
    read: boolean;
    createdAt: string | Date;
    actionUrl?: string;
}