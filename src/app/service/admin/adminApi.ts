import axios from "axios";
import { loginType } from "@/types/types";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";

const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const loginPost = async (userData: loginType) => {
    try {
        const response = await adminAxiosInstance.post(`${API_URI}/admin/login`, { ...userData }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const adminLogout = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/logout`, { withCredentials: true })
        return response
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getUserDetails = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/get-users`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export const userStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/user-status/${id}`, { status }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertDetails = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/get-experts`, { withCredentials: true })
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const expertStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/expert-status/${id}`, { status }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertById = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/getExpert/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const approveExpert = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/approve-expert`, { id }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const declineExpert = async (id: string, rejectionReason: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/decline-expert`, { id, rejectionReason }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

