import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const SubscriptionPurchase = async (planId: string) => {
    try {
        const res = await axiosInstance.post(`/user/subscription-checkout`, { planId });
        window.location.href = res.data.url;
    } catch (error) {
        handleAxiosError(error)
    }
};

