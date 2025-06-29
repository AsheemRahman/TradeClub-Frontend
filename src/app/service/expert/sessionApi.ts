import axios from "axios";
import { toast } from 'react-toastify'
import axiosInstance from "../shared/AxiosInstance";
import { AvailabilitySlot } from "@/types/sessionTypes";


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
        const response = await axiosInstance.get(`/expert/sessions`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const addSlot = async (updatedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.post(`/expert/add-session`, updatedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const editSlot = async (editedSlots: AvailabilitySlot) => {
    try {
        const response = await axiosInstance.patch(`/expert/edit-session`, editedSlots);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const deleteSlot = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/expert/delete-session/${id}`,);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};