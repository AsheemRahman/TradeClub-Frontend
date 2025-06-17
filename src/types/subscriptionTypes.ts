export interface IAccessLevel {
    expertCallsPerMonth?: number;
    videoAccess?: boolean;
    chatSupport?: boolean;
}

export interface ISubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
    accessLevel?: IAccessLevel;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubscriptionFormData {
    name: string;
    price: string;
    duration: string;
    features: string[];
    accessLevel: IAccessLevel;
    isActive: boolean;
}