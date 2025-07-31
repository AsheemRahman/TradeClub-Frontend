import axios from "axios";
import { toast } from 'react-toastify'
import axiosInstance from "../shared/AxiosInstance";
import { AvailabilitySlot, ISessionFilters } from "@/types/sessionTypes";


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const slotAvailability = async () => {
    try {
        const response = await axiosInstance.get(`/expert/slots`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const addSlot = async (updatedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.post(`/expert/add-slot`, updatedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const editSlot = async (editedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.patch(`/expert/edit-slot`, editedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const deleteSlot = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/expert/delete-slot/${id}`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get(`/expert/dashboard/stats`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getSessionAnalytics = async (period: '7d' | '30d' | '90d' = '30d') => {
    try {
        const response = await axiosInstance.get(`/expert/dashboard/analytics?period=${period}`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getSessions = async ( page : number, limit : number, filters :ISessionFilters) => {
    try {
        const response = await axiosInstance.get(`/expert/sessions`, { params: { page, limit, ...filters } });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};
