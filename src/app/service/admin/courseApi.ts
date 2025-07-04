import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
import { ICourseFormData } from "@/types/courseTypes";


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
        const response = await adminAxiosInstance.get(`/admin/category`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const addCategory = async (categoryName: string) => {
    try {
        const response = await adminAxiosInstance.post(`/admin/add-category`, { categoryName },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`/admin/delete-category/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const editCategory = async (id: string, categoryName: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/edit-category/${id}`, { categoryName },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getCourse = async () => {
    try {
        const response = await adminAxiosInstance.get(`/admin/courses`, );
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getCourseByID = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const addCourse = async (courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.post(`/admin/add-course`, courseData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const editCourse = async (id: string, courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.put(`/admin/edit-course/${id}`, courseData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const deleteCourse = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`/admin/delete-course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const togglePublish = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/course/${id}/toggle-publish`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};