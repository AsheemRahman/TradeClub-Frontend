import axios from "axios";
import { loginType } from "@/types/types";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const loginPost = async (userData: loginType) => {
    try {
        const response = await adminAxiosInstance.post(`/admin/login`, { ...userData },)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const adminLogout = async () => {
    try {
        const response = await adminAxiosInstance.get(`/admin/logout`,)
        return response
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getUserDetails = async () => {
    try {
        const response = await adminAxiosInstance.get(`admin/get-users`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

export const userStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/user-status/${id}`, { status },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertDetails = async () => {
    try {
        const response = await adminAxiosInstance.get(`/admin/get-experts`,)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const expertStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/expert-status/${id}`, { status },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getExpertById = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/getExpert/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const approveExpert = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/approve-expert`, { id },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const declineExpert = async (id: string, rejectionReason: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/decline-expert`, { id, rejectionReason },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};


