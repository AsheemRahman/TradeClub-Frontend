import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";

import { toast } from 'react-toastify';
import { UpdateProfilePayload } from "@/types/types";


const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;


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
        const response = await axiosInstance.post(`${API_URI}/user/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const resendOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post(`${API_URI}/user/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getUserProfile = async () => {
    try {
        const profile = await axiosInstance.get(`${API_URI}/user/get-profile`);
        return profile.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const updateProfile = async (updatedPayload: UpdateProfilePayload) => {
    try {
        const updateProfile = await axiosInstance.post(`${API_URI}/user/update-profile`, updatedPayload);
        return updateProfile.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const courseData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URI}/user/courses`, { withCredentials: true, });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const categoryData = async () => {
    try {
        const response = await axiosInstance.get(`${API_URI}/user/category`, { withCredentials: true, });
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