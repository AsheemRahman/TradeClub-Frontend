import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
import { ISubscriptionFormData } from "@/types/subscriptionTypes";


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

export const fetchPlans = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/fetch-plans`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const createPlan = async (planData: ISubscriptionFormData) => {
    try {
        const response = await adminAxiosInstance.post(`${API_URI}/admin/create-plan`, planData, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const updatePlan = async (id: string, planData: ISubscriptionFormData) => {
    try {
        const response = await adminAxiosInstance.put(`${API_URI}/admin/update-plan/${id}`, planData, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const deletePlan = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${API_URI}/admin/delete-plan/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const planStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/plan-status/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};