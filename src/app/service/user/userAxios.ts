import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { User, useAuthStore } from '@/store/authStore';

const API_URI = process.env.NEXT_PUBLIC_API_URI;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

interface RefreshResponse {
    success: boolean;
    data: {
        accessToken: string;
    };
    message: string;
}

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post<RefreshResponse>(`${API_URI}/user/refresh`, {}, { withCredentials: true });

        if (response.status === 200 && response.data.success) {
            const newAccessToken = response.data.data.accessToken;
            const user = useAuthStore.getState().user;

            useAuthStore.getState().setUserAuth(user as User, newAccessToken);
            Cookies.set('accessToken', newAccessToken, { path: '/', expires: 1 / 24, sameSite: 'Lax' });

            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
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
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken}`,
                };
                return axiosInstance(originalRequest);
            }

            useAuthStore.getState().logout();
            toast.error('Your session has expired. Please login again.');

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }

            return Promise.reject(new Error('Session expired.'));
        }

        // Show error toast only for non-401 errors
        if (error.response?.status !== 401) {
            toast.error(error.message || 'An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
