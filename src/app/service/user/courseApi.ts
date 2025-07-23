import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const courseData = async () => {
    try {
        const response = await axiosInstance.get(`/user/courses`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const categoryData = async () => {
    try {
        const response = await axiosInstance.get(`/user/category`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getCourseById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/user/course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const checkEnrolled = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/user/check-enrolled/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getProgress = async (courseId: string) => {
    try {
        const response = await axiosInstance.get(`/user/course/${courseId}/progress`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const updateCourseProgress = async (courseId: string, contentId: string, watchedDuration: number, isCompleted: boolean) => {
    try {
        const response = await axiosInstance.post(`/user/course/${courseId}/progress`, { contentId, watchedDuration, isCompleted, });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};