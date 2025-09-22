import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { USER } from "@/lib/constants";

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

const courseData = async (params?: { search?: string; category?: string; minPrice?: number; maxPrice?: number; sort?: string; page?: number; limit?: number; }) => {
    try {
        const response = await axiosInstance.get(`${USER}/courses`, { params });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const categoryData = async () => {
    try {
        const response = await axiosInstance.get(`${USER}/category`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getCourseById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`${USER}/course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const checkEnrolled = async (id: string) => {
    try {
        const response = await axiosInstance.get(`${USER}/check-enrolled/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getProgress = async (courseId: string) => {
    try {
        const response = await axiosInstance.get(`${USER}/course/${courseId}/progress`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const updateCourseProgress = async (courseId: string, contentId: string, watchedDuration: number, isCompleted: boolean) => {
    try {
        const response = await axiosInstance.post(`${USER}/course/${courseId}/progress`, { contentId, watchedDuration, isCompleted, });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getReviews = async (courseId: string) => {
    try {
        const response = await axiosInstance.get(`${USER}/${courseId}/reviews`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const addReview = async (courseId: string, { rating, comment }: { rating: number; comment: string }) => {
    try {
        const response = await axiosInstance.post(`${USER}/${courseId}/review`, { rating, comment });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const updateReview = async (courseId: string, { rating, comment }: { rating: number; comment: string }) => {
    try {
        const response = await axiosInstance.post(`${USER}/${courseId}/edit-review`, { rating, comment });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const courseApi = {
    courseData,
    categoryData,
    getCourseById,
    checkEnrolled,
    getProgress,
    updateCourseProgress,
    getReviews,
    addReview,
    updateReview,
};

export default courseApi;