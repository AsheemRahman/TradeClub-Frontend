import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuthStore, User } from '@/store/authStore';


const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;


const adminAxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});


const refreshAccessToken = async (): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URI}/admin/refresh-token`, {}, { withCredentials: true });
        return response.data.status === true;
    } catch (error) {
        console.error('Error refreshing admin token:', error);
        return false;
    }
};

// Request Interceptor
adminAxiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('admin-accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
adminAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAccessToken();
            if (newToken) {
                const newToken = Cookies.get('admin-accessToken');
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    const user = useAuthStore.getState().user;
                    useAuthStore.getState().setUserAuth(user as User, newToken);
                }
                return adminAxiosInstance(originalRequest);
            }

            useAuthStore.getState().logout();
            toast.error('Your session has expired. Please login again.');
            if (typeof window !== 'undefined') {
                window.location.href = '/admin/login';
            }

            return Promise.reject(new Error('Admin session expired.'));
        }

        // Handle other errors
        if (error.response?.status !== 401) {
            toast.error(error.message || 'An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

export default adminAxiosInstance;
