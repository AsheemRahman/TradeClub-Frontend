import { ExpertFormData } from "@/types/types";
import axios from "axios";
import { toast } from 'react-toastify'


const API_URI = process.env.NEXT_PUBLIC_BACKEND_API;

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
        const response = await axios.post(`${API_URI}/expert/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};


export const resendExpertOtp = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/expert/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const expertLoginPost = async (formData: userloginType) => {
    try {
        const response = await axios.post(`${API_URI}/${formData.role}/login`, formData, { withCredentials: true, });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};


export const expertVerification = async (formData: ExpertFormData) => {
    try {
        const response = await axios.post(`${API_URI}/expert/verification`, formData, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};
