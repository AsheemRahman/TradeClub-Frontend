import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { UpdateProfilePayload } from "@/types/types";


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

export const SubscriptionData = async () => {
    try {
        const response = await axiosInstance.get(`/user/fetch-plans`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getAllExpert = async () => {
    try {
        const response = await axiosInstance.get(`/user/experts`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertById = async (expertId: string) => {
    try {
        const response = await axiosInstance.get(`/user/expert/${expertId}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertAvailability = async (expertId: string, startDate: Date, endDate: Date) => {
    try {
        const response = await axiosInstance.get(`/user/expert/${expertId}/availability?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const checkSubscription = async () => {
    try {
        const response = await axiosInstance.get(`/user/check-subscription`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

type SessionStatus = 'upcoming' | 'completed' | 'missed';

interface ISessions {
    page: string;
    limit: string;
    status?: SessionStatus;
}

export const getSessions = async (params: ISessions) => {
    try {
        const response = await axiosInstance.get('/user/sessions', { params });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
