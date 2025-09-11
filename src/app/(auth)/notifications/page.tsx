"use client"

import React, { useState } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
import { Bell } from 'lucide-react';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'course' | 'consultation' | 'subscription' | 'system' | string;
    priority: 'high' | 'medium' | 'low';
    read: boolean;
    createdAt: string | Date;
    actionUrl?: string;
}


const NotificationsPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const { notifications, unreadCount, loading, hasMore, loadMore, markAsRead, markAllAsRead, } = useNotifications();

    // Apply filter
    const filteredNotifications = notifications.filter((notification: Notification) => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true;
    });

    // Format notification timestamp
    const formatDate = (timestamp: string | Date): string => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get icon for notification type
    const getNotificationIcon = (type: string): string => {
        switch (type) {
            case 'course':
                return '📚';
            case 'consultation':
                return '👨‍⚕️';
            case 'subscription':
                return '💳';
            case 'system':
                return '⚙️';
            default:
                return '📢';
        }
    };

    // Priority badge renderer
    const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
        const colors: Record<typeof priority, string> = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800',
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}
            >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                <Bell className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                                <p className="text-white/80 mt-1 text-md">Stay updated with your latest activities and announcements</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* Stats and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                        <p className="text-sm text-gray-600">Total Notifications</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                        <p className="text-sm text-gray-600">Unread</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Mark All as Read
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {(['all', 'unread', 'read'] as const).map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${filter === filterOption
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                            {filterOption === 'unread' && unreadCount > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading && notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {filter === 'unread'
                                ? 'No unread notifications'
                                : filter === 'read'
                                    ? 'No read notifications'
                                    : 'No notifications'}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'all'
                                ? "You don't have any notifications yet."
                                : `You don't have any ${filter} notifications.`}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3
                                            className={`text-lg font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''
                                                }`}
                                        >
                                            {notification.title}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {getPriorityBadge(notification.priority)}
                                            {!notification.read && (
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-3">{notification.message}</p>

                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(notification.createdAt)}
                                        </p>

                                        <div className="flex items-center space-x-2">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                            {notification.actionUrl && (
                                                <a
                                                    href={notification.actionUrl}
                                                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    View
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More Button */}
            {hasMore && filteredNotifications.length > 0 && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
