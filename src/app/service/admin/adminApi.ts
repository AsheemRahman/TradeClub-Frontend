import axios from "axios";
import { GetUserParams, ICoupon, loginType } from "@/types/types";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";
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


const loginPost = async (userData: loginType) => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/login`, { ...userData },)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

const adminLogout = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/logout`,)
        return response
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

const getUserDetails = async (params?: GetUserParams) => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/get-users`, { params });
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
}

const userStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/user-status/${id}`, { status },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getExpertDetails = async (params?: { search?: string; page?: number; limit?: number; }) => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/get-experts`, { params });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const expertStatus = async (id: string, status: boolean) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/expert-status/${id}`, { status },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getExpertById = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/getExpert/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const approveExpert = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/approve-expert`, { id },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const declineExpert = async (id: string, rejectionReason: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/decline-expert`, { id, rejectionReason },);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const fetchCoupon = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/coupons`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const createCoupon = async (couponData: ICoupon) => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/create-coupon`, couponData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const updateCoupon = async (id: string, couponData: ICoupon) => {
    try {
        const response = await adminAxiosInstance.put(`${ADMIN}/update-coupon/${id}`, couponData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const deleteCoupon = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`${ADMIN}/delete-coupon/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const couponStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${ADMIN}/coupon-status/${id}`,);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getOrders = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/orders`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getUser = async (userId: string) => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/user/${userId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getItem = async (itemId: string, itemType: 'Course' | 'SubscriptionPlan') => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/${itemType}/${itemId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getRevenue = async () => {
    try {
        const response = await adminAxiosInstance.get(`${ADMIN}/revenue`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const adminApi = {
    loginPost,
    adminLogout,
    getUserDetails,
    userStatus,
    getExpertDetails,
    expertStatus,
    getExpertById,
    approveExpert,
    declineExpert,
    fetchCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    couponStatus,
    getOrders,
    getUser,
    getItem,
    getRevenue,
};

export default adminApi;