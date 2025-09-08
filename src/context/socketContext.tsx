'use client'

import { io, Socket } from 'socket.io-client';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

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
    const { user } = useAuthStore();
    const [onlineUser, setOnlineUser] = useState<string[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const userId = expert?.id || user?.id;

    useEffect(() => {
        if (!userId) {
            // disconnect if no user
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setOnlineUser([]);
            return;
        }

        // ✅ only create socket if not already connected
        if (!socketRef.current) {
            const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
                transports: ['websocket'],
                autoConnect: true,
                query: { userId },
            });

            socketRef.current = socketInstance;

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
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUser }}>
            {children}
        </SocketContext.Provider>
    );
};
