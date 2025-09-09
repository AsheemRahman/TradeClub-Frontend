import axios from "axios";
import { toast } from 'react-toastify'
import axiosInstance from "../shared/AxiosInstance";
import { ExpertProfileFormData, ExpertFormData } from "@/types/expertTypes";
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


const expertVerifyOtp = async (otp: number, email: string) => {
    try {
        const response = await axiosInstance.post(`${EXPERT}/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

const resendExpertOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post(`${EXPERT}/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


const expertVerification = async (formData: ExpertFormData) => {
    try {
        const response = await axiosInstance.post(`${EXPERT}/verification`, formData,);
        return response;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

const getExpertData = async () => {
    try {
        const expertData = await axiosInstance.get(`${EXPERT}/get-expert`);
        return expertData.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

const updateProfile = async (updatedPayload: ExpertProfileFormData) => {
    try {
        const updateProfile = await axiosInstance.post(`${EXPERT}/update-profile`, updatedPayload);
        return updateProfile.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

const fetchWallet = async () => {
    try {
        const response = await axiosInstance.get(`${EXPERT}/wallet`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};


const expertApi = {
    expertVerifyOtp,
    resendExpertOtp,
    expertVerification,
    getExpertData,
    updateProfile,
    fetchWallet,
};

export default expertApi;