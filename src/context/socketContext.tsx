'use client'

import { io, Socket } from 'socket.io-client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useExpertStore } from '@/store/expertStore';

interface SocketContextType {
    socket: Socket | null;
    onlineUser: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const { expert } = useExpertStore();
    const { user } = useAuthStore()
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUser, setOnlineUser] = useState<string[]>([]);
    const userId = expert?.id || user?.id;

    useEffect(() => {
        if (!userId) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setOnlineUser([]);
            }
            return;
        }
        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            query: { userId },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('getOnlineUser', (users) => {
            console.log('Online users:', users);
            setOnlineUser(users);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            socketInstance.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, onlineUser }}>
            {children}
        </SocketContext.Provider>
    );
};