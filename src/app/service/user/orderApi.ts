import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { ICourse } from "@/types/courseTypes";
import { BookingData } from "@/types/bookingTypes";
import { USER } from "@/lib/constants";

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

const SubscriptionPurchase = async (planId: string) => {
    try {
        const res = await axiosInstance.post(`${USER}/subscription-checkout`, { planId });
        window.location.href = res.data.url;
    } catch (error) {
        handleAxiosError(error)
    }
};

const handlePurchase = async (course: ICourse) => {
    try {
        const res = await axiosInstance.post(`${USER}/create-checkout-session`, { course });
        window.location.href = res.data.url;
    } catch (error) {
        handleAxiosError(error)
    }
};

const getPurchase = async () => {
    try {
        const response = await axiosInstance.get(`${USER}/purchase-history`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

const getPurchasedCourses = async () => {
    try {
        const response = await axiosInstance.get(`${USER}/purchased-courses`);
        return response.data;
    } catch (error) {
        handleAxiosError(error)
    }
};

const createOrder = async (sessionId: string) => {
    try {
        const response = await axiosInstance.post(`${USER}/create-order`, { sessionId });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const createFailedOrder = async (sessionId: string) => {
    try {
        const response = await axiosInstance.post(`${USER}/order-failed`, { sessionId });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const slotBooking = async (slotBooking: BookingData) => {
    try {
        const response = await axiosInstance.post(`${USER}/slot-booking`, slotBooking);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const orderApi = {
    SubscriptionPurchase,
    handlePurchase,
    getPurchase,
    getPurchasedCourses,
    createOrder,
    createFailedOrder,
    slotBooking,
};

export default orderApi;