export interface ICourseContent {
    title: string;
    videoUrl: string;
    duration: number;
}

export interface ICategory {
    _id: string;
    name: string;
}

export interface ICourse {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: ICategory;
    purchasedUsers?: number;
    content: ICourseContent[];
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICourseFormData {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    content: ICourseContent[];
    isPublished: boolean;
}