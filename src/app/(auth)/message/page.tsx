'use client'

import React, { useEffect, useState } from 'react';
import ChatSidebar from '@/components/shared/chatSidebar';
import ChatWindow from '@/components/shared/chatWindow';
import { UserMinimal } from '@/types/types';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
import { getExpertById } from '@/app/service/user/userApi';


const Chat = () => {
    const { user } = useAuthStore()
    const userId = user?.id as string;
    const searchParams = useSearchParams();
    const expertId = searchParams.get('expertId');
    const [selectedUser, setSelectedUser] = useState<UserMinimal | null>(null);

    // Fetch expert data when expertId is present in URL
    useEffect(() => {
        if (expertId) {
            const fetchExpert = async () => {
                try {
                    const expertResponse = await getExpertById(expertId);
                    if (!expertResponse.status) throw new Error('Expert not found');
                    setSelectedUser(expertResponse.expert);
                } catch (error) {
                    console.error('Failed to fetch expert:', error);
                }
            };
            fetchExpert();
        }
    }, [expertId]);

    return (
        <div className="min-h-screen bg-gray-100 mx-5 rounded-lg">
            <div className="h-screen flex">
                <ChatSidebar role={"User"} onSelectUser={setSelectedUser} selectedUserId={selectedUser?._id} />
                <ChatWindow role={"User"} selectedUser={selectedUser} currentUserId={userId} />
            </div>
        </div>
    );
}

export default Chat;