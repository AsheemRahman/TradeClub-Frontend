import axios from "axios";
import axiosInstance from "./AxiosInstance";

import { toast } from 'react-toastify'
import { RegisterPayload } from "@/types/types";



interface loginType {
    email: string;
    password: string;
    role: 'user' | 'expert';
}

interface googleLogin {
    fullName: string | null | undefined,
    email: string | null | undefined;
    profilePicture?: string,
    role: 'user' | 'expert';
}

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Something went wrong!");
    } else {
        console.error("Unknown error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const registerPost = async (userData: RegisterPayload) => {
    try {
        const response = await axiosInstance.post(`/${userData.role}/register`, userData,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};


export const LoginPost = async (formData: loginType) => {
    try {
        const response = await axiosInstance.post(`/${formData.role}/login`, formData,);
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
        const response = await axiosInstance.post(`/${role}/forgot-password`, { email })
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
        const response = await axiosInstance.patch(`/${role}/reset-password`, { email, password })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const googleSignup = async (userData: googleLogin) => {
    try {
        const response = await axiosInstance.post(`/${userData.role}/google-login`, userData,)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const logoutApi = async (role: string) => {
    try {
        const response = await axiosInstance.get(`/${role}/logout`,)
        return response
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}