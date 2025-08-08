import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export interface Expert {
    id: string;
    role: 'expert';
    isVerified?: 'Approved' | 'Pending' | 'Declined';
}

interface AuthState {
    expert: Expert | null;
    token: string | null;
    setExpertAuth: (expert: Expert, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useExpertStore = create<AuthState>()(
    persist((set, get) => ({
        expert: null,
        token: null,

        setExpertAuth: (expert, token) => {
            set({ expert, token });
        },

        isAuthenticated: () => {
            const { expert, token } = get();
            return !!expert && !!token;
        },

        logout: async () => {
            set({ expert: null, token: null });
        },
    }),{ name: 'tradeclub-expert' })
);