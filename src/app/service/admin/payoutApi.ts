import axios from "axios";
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

const payouts = async () => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/payouts/run-payouts`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getPendingPayouts = async () => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/payouts/pending`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const getLastPayoutDate = async () => {
    try {
        const response = await adminAxiosInstance.post(`${ADMIN}/payouts/last-payout-date`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const payoutApi = {
    payouts,
    getPendingPayouts,
    getLastPayoutDate,
};

export default payoutApi;