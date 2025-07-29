import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { ICourse } from "@/types/courseTypes";
import { BookingData } from "@/types/bookingTypes";

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

export const handlePurchase = async (course: ICourse) => {
    try {
        const res = await axiosInstance.post(`/user/create-checkout-session`, { course });
        window.location.href = res.data.url;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const getPurchase = async () => {
    try {
        const response = await axiosInstance.get(`/user/purchase-history`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const getPurchasedCourses = async () => {
    try {
        const response = await axiosInstance.get(`/user/purchased-courses`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

export const createOrder = async (sessionId: string) => {
    try {
        const response = await axiosInstance.post(`/user/create-order`, { sessionId });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const createFailedOrder = async (sessionId: string) => {
    try {
        const response = await axiosInstance.post(`/user/order-failed`, { sessionId });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const slotBooking = async (slotBooking: BookingData) => {
    try {
        const response = await axiosInstance.post(`/user/slot-booking`, slotBooking);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};