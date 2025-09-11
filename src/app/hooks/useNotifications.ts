import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import notificationAPI from '@/app/service/shared/notificationAPI';
import { useSocketContext } from "@/context/socketContext";
import { NotificationType } from '@/types/notificationTypes';


export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const { user } = useAuthStore();
    const socketContext = useSocketContext();
    const socket = socketContext?.socket;

    // Fetch notifications
    const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            const response = await notificationAPI.getNotifications({ page: pageNum, limit: 20, unreadOnly: false, });
            const { notifications: fetched, unreadCount, hasMore } = response.data;
            if (append) {
                setNotifications((prev) => [...prev, ...fetched]);
            } else {
                setNotifications(fetched);
            }
            setUnreadCount(unreadCount);
            setHasMore(hasMore);
            setPage(pageNum);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === "object" && err !== null && "response" in err) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setError((err as any).response?.data?.message || "Failed to fetch notifications");
            } else {
                setError("Failed to fetch notifications");
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Load more notifications
    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            fetchNotifications(page + 1, true);
        }
    }, [hasMore, loading, page, fetchNotifications]);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === notificationId ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
        }
    }, []);

    // Handle real-time notifications
    useEffect(() => {
        if (socket) {
            const handleNewNotification = (notification: NotificationType) => {
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);

                if (Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/icon-192x192.png',
                    });
                }
            };

            socket.on('notification', handleNewNotification);
            return () => {
                socket.off('notification', handleNewNotification);
            };
        }
    }, [socket]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Request browser notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        hasMore,
        fetchNotifications,
        loadMore,
        markAsRead,
        markAllAsRead,
    };
};
