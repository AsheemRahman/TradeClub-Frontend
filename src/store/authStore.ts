import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface User {
    id: string;
    role: 'user';
}


interface AuthState {
    user: User | null;
    token: string | null;
    setUserAuth: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        user: null,
        token: null,

        setUserAuth: (user, token) => {
            set({ user, token });
        },

        isAuthenticated: () => {
            const { user, token } = get();
            return !!user && !!token;
        },

        logout: async () => {
            set({ user: null, token: null });
        },
    }), { name: 'tradeclub-auth' })
);