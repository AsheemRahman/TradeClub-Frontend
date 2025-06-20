import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
import { ICourseFormData } from "@/types/courseTypes";

const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
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

export const getCourse = async () => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/courses`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getCourseByID = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/course/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const addCourse = async (courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.post(`${API_URI}/admin/add-course`, courseData, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const editCourse = async (id: string, courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.put(`${API_URI}/admin/edit-course/${id}`, courseData, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const deleteCourse = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${API_URI}/admin/delete-course/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const togglePublish = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/course/${id}/toggle-publish`, { withCredentials: true });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};