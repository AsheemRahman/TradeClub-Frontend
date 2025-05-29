import axios from "axios";
import { toast } from 'react-toastify'


const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const verifyOtp = async (otp: number, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/user/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};


export const resendOtp = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/user/resend-otp`, { email })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}