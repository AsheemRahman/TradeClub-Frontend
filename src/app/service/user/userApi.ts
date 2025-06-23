import axios from "axios";
import { toast } from 'react-toastify';
import axiosInstance from "../shared/AxiosInstance";
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