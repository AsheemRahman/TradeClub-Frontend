import axios from "axios";
import { adminloginType } from "@/types/types";
import { toast } from 'react-toastify'

const API_URI = process.env.NEXT_PUBLIC_BACKEND_API;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const loginPost = async (userData: adminloginType) => {
    try {
        const response = await axios.post(`${API_URI}/admin/login`, { ...userData }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}