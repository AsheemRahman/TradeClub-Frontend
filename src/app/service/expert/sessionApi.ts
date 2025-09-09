import axios from "axios";
import { toast } from 'react-toastify'
import axiosInstance from "../shared/AxiosInstance";
import { AvailabilitySlot, ISessionFilters } from "@/types/sessionTypes";
import { EXPERT } from "@/lib/constants";


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
        const response = await axiosInstance.get(`${EXPERT}/slots`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const addSlot = async (updatedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.post(`${EXPERT}/add-slot`, updatedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const editSlot = async (editedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.patch(`${EXPERT}/edit-slot`, editedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const deleteSlot = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${EXPERT}/delete-slot/${id}`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get(`${EXPERT}/dashboard/stats`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getSessionAnalytics = async (period: '7d' | '30d' | '90d' = '30d') => {
    try {
        const response = await axiosInstance.get(`${EXPERT}/dashboard/analytics?period=${period}`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getSessions = async ( page : number, limit : number, filters :ISessionFilters) => {
    try {
        const response = await axiosInstance.get(`${EXPERT}/sessions`, { params: { page, limit, ...filters } });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};
