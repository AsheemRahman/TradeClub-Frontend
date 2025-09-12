import React, { useCallback, useEffect, useState } from 'react';
import { Users, Circle, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useExpertStore } from '@/store/expertStore';
import useConversation from '@/store/conversationStore';
import { UserMinimal } from '@/types/types';
import chatApi from '@/app/service/shared/chatApi';
import { useSocketContext } from '@/context/socketContext';
import Image from 'next/image';

interface ChatSidebarProps {
    role: 'User' | 'Expert';
    onSelectUser: (user: UserMinimal) => void;
    selectedUserId?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ role, onSelectUser, selectedUserId }) => {
    const [users, setUsers] = useState<UserMinimal[]>([]);
    const studentUser = useAuthStore((state) => state.user);
    const tutorUser = useExpertStore((state) => state.expert);
    const { onlineUser = [] } = useSocketContext() || {};
    const { lastMessageMeta, unreadCounts, resetUnreadCount, setSelectedConversation } = useConversation();

    const userId = role === 'User' ? studentUser?.id : tutorUser?.id;

    const fetchChats = useCallback(async () => {
        try {
            const response = await chatApi.getChats(role);
            if (response) {
                const usersWithUnread = response.data.map((user: UserMinimal) => ({
                    ...user,
                    unreadCount: user.unreadCount || unreadCounts[user._id] || 0,
                    updatedAt: user.updatedAt || new Date().toISOString(),
                }));
                setUsers(usersWithUnread.sort((a: UserMinimal, b: UserMinimal) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()));
            }
        } catch (error) {
            console.log('Error fetching chats:', error);
        }
    }, [role, unreadCounts]);

    useEffect(() => {
        if (userId) {
            fetchChats();
        }
    }, [userId, fetchChats]);

    useEffect(() => {
        if (!lastMessageMeta || !userId) return;
        const { senderId, receiverId, message } = lastMessageMeta;
        const otherUserId = senderId === userId ? receiverId : senderId;

        setUsers((prevUsers) => {
            const userIndex = prevUsers.findIndex((user) => user._id === otherUserId);
            if (userIndex === -1) {
                fetchChats();
                return prevUsers;
            }

            const updatedUser = {
                ...prevUsers[userIndex],
                lastMessage: message,
                unreadCount: unreadCounts[otherUserId] || prevUsers[userIndex].unreadCount || 0,
                updatedAt: new Date().toISOString(),
            };

            const newUsers = [
                updatedUser,
                ...prevUsers.slice(0, userIndex),
                ...prevUsers.slice(userIndex + 1),
            ].sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
            return newUsers;
        });
    }, [lastMessageMeta, userId, unreadCounts, fetchChats]);

    const isUserOnline = (userId: string) => {
        return Array.isArray(onlineUser) && onlineUser.includes(userId);
    };

    const handleSelectUser = (user: UserMinimal) => {
        onSelectUser(user);
        setSelectedConversation(user);
        resetUnreadCount(user._id);
        setUsers(prevUsers => prevUsers.map(u => u._id === user._id ? { ...u, unreadCount: 0 } : u));
    };

    return (
        <div className="w-80 bg-white h-full border-r border-gray-200 flex flex-col rounded-l-lg">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3 mt-2">
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                    </div>
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {users.map((user, index) => (
                    <div key={user._id} onClick={() => handleSelectUser(user)}
                        className={`flex items-center p-4 cursor-pointer transition-colors ${selectedUserId === user._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${index !== users.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                        <div className="relative">
                            {user.profilePicture ? (
                                <Image src={user.profilePicture} alt={user.fullName} width={56} height={56} className="w-14 h-14 rounded-full object-cover"/>
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                                </div>
                            )}
                            {/* Online/Offline indicator */}
                            <div className="absolute bottom-0 right-0 border-2 border-white rounded-full">
                                <Circle fill={isUserOnline(user._id) ? '#10B981' : '#9CA3AF'} className={`w-3 h-3 ${isUserOnline(user._id) ? 'text-emerald-500' : 'text-gray-400'}`}/>
                            </div>
                        </div>

                        <div className="ml-3 flex-1 min-w-0 flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-base font-medium text-gray-900 truncate">{user.fullName}</p>
                                {/* <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p> */}
                                <p className="text-sm text-gray-600 truncate" style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={user.lastMessage} >
                                    {user.lastMessage}
                                </p>
                            </div>
                            {(user.unreadCount || unreadCounts[user._id] || 0) > 0 && selectedUserId !== user._id && (
                                <span className="bg-indigo-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                    {user.unreadCount || unreadCounts[user._id]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;