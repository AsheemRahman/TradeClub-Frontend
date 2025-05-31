import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAuthStore, User } from '@/store/authStore';


const API_URI = process.env.NEXT_PUBLIC_API_BASE_URL;


const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});


const refreshAccessToken = async (): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URI}/user/refresh-token`, {}, { withCredentials: true });
        return response.data.status === true;
    } catch (error) {
        console.error('Error refreshing admin token:', error);
        return false;
    }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAccessToken();
            if (newToken) {
                const newToken = Cookies.get('accessToken');
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    const user = useAuthStore.getState().user;
                    useAuthStore.getState().setUserAuth(user as User, newToken);
                }
                return axiosInstance(originalRequest);
            }

            useAuthStore.getState().logout();
            toast.error('Your session has expired. Please login again.');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }

            return Promise.reject(new Error('session expired.'));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
