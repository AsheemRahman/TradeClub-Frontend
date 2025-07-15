import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { UpdateProfilePayload } from "@/types/types";
import { ICourse } from "@/types/courseTypes";


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const verifyOtp = async (otp: number, email: string) => {
    try {
        const response = await axiosInstance.post(`/user/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const resendOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post(`/user/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getUserProfile = async () => {
    try {
        const profile = await axiosInstance.get(`/user/get-profile`);
        return profile.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const updateProfile = async (updatedPayload: UpdateProfilePayload) => {
    try {
        const updateProfile = await axiosInstance.post(`/user/update-profile`, updatedPayload);
        return updateProfile.data;
    } catch (error) {
        handleAxiosError(error)
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

export const SubscriptionData = async () => {
    try {
        const response = await axiosInstance.get(`/user/fetch-plans`,);
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

export const createOrder = async (sessionId: string, courseId: string) => {
    try {
        const response = await axiosInstance.post(`/user/create-order`, { sessionId, courseId });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const handlePurchase = async (course: ICourse) => {
    try {
        const res = await axiosInstance.post(`/user/create-checkout-session`, { course });
        window.location.href = res.data.url;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const getPurchase = async () => {
    try {
        const response = await axiosInstance.get(`/user/purchase-history`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const getPurchasedCourses = async () => {
    try {
        const response = await axiosInstance.get(`/user/purchased-courses`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
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