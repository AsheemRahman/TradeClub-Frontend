import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
import { ISubscriptionFormData } from "@/types/subscriptionTypes";
import { ADMIN } from "@/lib/constants";


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

const fetchPlans = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/fetch-plans`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const createPlan = async (planData: ISubscriptionFormData) => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/create-plan`, planData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const updatePlan = async (id: string, planData: ISubscriptionFormData) => {
    try {
        const response = await adminAxiosInstance.put(`${ADMIN}/update-plan/${id}`, planData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const deletePlan = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${ADMIN}/delete-plan/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const planStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/plan-status/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const subscriptionApi = {
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    planStatus,
};

export default subscriptionApi;