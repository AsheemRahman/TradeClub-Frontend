export interface ICourseContent {
    _id: string,
    title: string;
    videoUrl: string;
    duration: number;
}

export interface ICategory {
    _id: string;
    categoryName: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICourse {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    purchasedUsers?: number;
    content: ICourseContent[];
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICourseFormData {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    content: ICourseContent[];
    isPublished: boolean;
}

export interface IVideoProgress {
    contentId: string;
    watchedDuration: number;
    isCompleted: boolean;
    lastWatchedAt?: string;
}

export interface ICourseProgress {
    _id: string;
    user: string;
    course: string;
    progress: IVideoProgress[];
    totalCompletedPercent: number;
    lastWatchedAt?: string;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPurchasedCourse {
    course: ICourse;
    progress: ICourseProgress;
    purchaseDate: string;
}