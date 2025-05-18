import axios from "axios";
import { toast } from 'react-toastify'


const API_URI = process.env.NEXT_PUBLIC_BACKEND_API;

interface RegisterPayload {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: 'user' | 'expert';
}


interface loginType {
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


export const registerPost = async (userData: RegisterPayload) => {
    try {
        const response = await axios.post(`${API_URI}/${userData.role}/register`, userData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};


export const LoginPost = async (formData: loginType) => {
    try {
        const response = await axios.post(`${API_URI}/${formData.role}/login`, formData, { withCredentials: true, });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};


export const forgotPassword = async (email: string, role: string) => {
    if (!email) {
        toast.error("email is empty. please try again")
        return;
    }
    try {
        const response = await axios.post(`${API_URI}/${role}/forgot-password`, { email })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const resetPassword = async (email: string, password: string, role: string) => {
    if (!password) {
        toast.error("password is empty. please try again")
        return;
    }
    try {
        const response = await axios.patch(`${API_URI}/${role}/reset-password`, { email, password })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}