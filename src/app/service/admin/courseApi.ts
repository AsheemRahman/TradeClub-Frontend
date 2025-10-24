import axios from "axios";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
import { ICourseFormData } from "@/types/courseTypes";
import { ADMIN } from "@/lib/constants";
import { CATEGORY } from "@/lib/routeConstants";


export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

const getCategory = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/${CATEGORY}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const addCategory = async (categoryName: string) => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/add-category`, { categoryName },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const deleteCategory = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${ADMIN}/delete-category/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const editCategory = async (id: string, categoryName: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/edit-category/${id}`, { categoryName },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getCourse = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/courses`, );
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getCourseByID = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const addCourse = async (courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/add-course`, courseData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const editCourse = async (id: string, courseData: ICourseFormData) => {
    try {
        const response = await adminAxiosInstance.put(`${ADMIN}/edit-course/${id}`, courseData,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const deleteCourse = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${ADMIN}/delete-course/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const togglePublish = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/course/${id}/toggle-publish`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const courseApi = {
    getCategory,
    addCategory,
    deleteCategory,
    editCategory,
    getCourse,
    getCourseByID,
    addCourse,
    editCourse,
    deleteCourse,
    togglePublish,
};

export default courseApi;