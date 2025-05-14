import axios from "axios";
import { toast } from 'react-toastify'

const API_URI = process.env.NEXT_PUBLIC_BACKEND_API;


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};



interface RegisterPayload {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: 'user' | 'expert';
}

export const registerPost = async (userData: RegisterPayload) => {
    try {
        const response = await axios.post(`${API_URI}/${userData.role}/register`, userData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};


export const verifyOtp = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/user/verify-otp`, { otp, email });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};