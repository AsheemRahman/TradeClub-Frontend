import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";

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

export const getCategory = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/category`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const addCategory = async (categoryName: string) => {
    try {
        const response = await adminAxiosInstance.post(`${API_URI}/admin/add-category`, { categoryName }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${API_URI}/admin/delete-category/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const editCategory = async (id: string, categoryName: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/edit-category/${id}`, { categoryName }, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

