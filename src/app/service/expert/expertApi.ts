import axios from "axios";
import { toast } from 'react-toastify'
import axiosInstance from "../shared/AxiosInstance";
import { ExpertProfileFormData, ExpertFormData } from "@/types/expertTypes";


interface userloginType {
    email: string;
    password: string;
    role: 'user' | 'expert';
}

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const expertVerifyOtp = async (otp: number, email: string) => {
    try {
        const response = await axiosInstance.post(`/expert/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const resendExpertOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post(`/expert/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const expertLoginPost = async (formData: userloginType) => {
    try {
        const response = await axiosInstance.post(`/${formData.role}/login`, formData,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const expertVerification = async (formData: ExpertFormData) => {
    try {
        const response = await axiosInstance.post(`/expert/verification`, formData,);
        return response;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getExpertData = async () => {
    try {
        const expertData = await axiosInstance.get(`/expert/get-expert`);
        return expertData.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const updateProfile = async (updatedPayload: ExpertProfileFormData) => {
    try {
        const updateProfile = await axiosInstance.post(`/expert/update-profile`, updatedPayload);
        return updateProfile.data;
    } catch (error) {
        handleAxiosError(error)
    }
};