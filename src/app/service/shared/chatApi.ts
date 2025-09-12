import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


const getChats = async (role: string) => {
    try {
        const response = await axiosInstance.get(`/chat/getChats?role=${role}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

const sendMessage = async ( receiverId: string, message: string, role: string, imageUrl?: string) => {
    try {
        const response = await axiosInstance.post(`/chat/send/${receiverId}`, { message, imageUrl});
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
        throw error;
    }
};

const getMessages = async (reciverId: string,) => {
    try {
        const response = await axiosInstance.get(`/chat/get-messages/${reciverId}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

const deleteMessages = async (receiverId: string, messageIds: string[]) => {
    try {
        const response = await axiosInstance.delete(`/chat/delete-message/${receiverId}`, { data: { messageIds } })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

const markMessagesAsRead = async (receiverId: string) => {
    try {
        const response = await axiosInstance.post(`/chat/mark-read/${receiverId}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


const chatApi = {
    getChats,
    sendMessage,
    getMessages,
    deleteMessages,
    markMessagesAsRead
};

export default chatApi;