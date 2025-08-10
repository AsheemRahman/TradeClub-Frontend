import axios from "axios";
import axiosInstance from "../shared/AxiosInstance";
import { toast } from 'react-toastify';
import { SessionData } from "@/types/types";

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "API Error");
    } else {
        console.error("Unexpected Error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


export const getChats = async (role: string) => {
    try {
        // const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        const response = await axiosInstance.get(`/chat/getChats?role=${role}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createChat = async (id: string) => {
    try {
        const response = await axiosInstance.post(`/chat/create-chat/${id}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


// chatService.ts
export const sendMessage = async ( receiverId: string, message: string, role: string, imageUrl?: string) => {
    console.log("Image url", imageUrl)
    try {
        // const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        // const response = await axiosInstance.post(`/${role}/chat/send/${receiverId}`, {
        const response = await axiosInstance.post(`/chat/send/${receiverId}`, { message, imageUrl});
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
        throw error;
    }
};

export const getMessages = async (reciverId: string,) => {
    try {
        // const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        // const response = await axiosInstance.get(`/${role}/chat/get-messages/${reciverId}`);
        const response = await axiosInstance.get(`/chat/get-messages/${reciverId}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

// chatService.ts

export const deleteMessages = async (receiverId: string, messageIds: string[]) => {
    try {
        // const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        // const response = await axiosInstance.delete(`/${role}/chat/delete-message/${receiverId}`, { data: { messageIds } })
        const response = await axiosInstance.delete(`/chat/delete-message/${receiverId}`, { data: { messageIds } })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const markMessagesAsRead = async (receiverId: string) => {
    try {
        // const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        // const response = await axiosInstance.post(`/${role}/chat/mark-read/${receiverId}`);
        const response = await axiosInstance.post(`/chat/mark-read/${receiverId}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createSession = async (sessionData: SessionData) => {
    try {
        console.log("session data from api service", sessionData);
        const response = await axiosInstance.post('/tutor/sessions', { sessionData });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}