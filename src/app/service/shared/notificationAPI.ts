import axios from "axios";
import axiosInstance from "./AxiosInstance";
import { toast } from 'react-toastify'


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Something went wrong!");
    } else {
        console.error("Unknown error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const getNotifications = async (params: unknown) => {
    try {
        const response = await axiosInstance.get(`/notifications`, { params });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const markAsRead = async (notificationId: string) => {
    try {
        const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await axiosInstance.patch('/notifications/mark-all-read');
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const createNotification = async (data: unknown) => {
    try {
        const response = await axiosInstance.post('/notifications', data);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const notifyCourseEnrollment = async (data: unknown) => {
    try {
        const response = await axiosInstance.post('/notifications/enrollment', data);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const notifySubscriptionPurchase = async (data: unknown) => {
    try {
        const response = await axiosInstance.post('/notifications/subscription-purchase', data);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const notifyConsultationScheduled = async (consultationId: string, consultationDate: Date) => {
    try {
        const response = await axiosInstance.post('/notifications/consultation', { consultationId, consultationDate });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const notifySubscriptionExpiring = async (data: unknown) => {
    try {
        const response = await axiosInstance.post('/notifications/subscription', data);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const notifyNewCourseAvailable = async (courseId: string, courseName: string) => {
    try {
        const response = await axiosInstance.post('/notifications/new-course', { courseId, courseName });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};


const notificationAPI = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
};

export default notificationAPI;