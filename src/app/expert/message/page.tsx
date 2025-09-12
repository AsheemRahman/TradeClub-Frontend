'use client'

import React, { useState } from 'react';

import ChatSidebar from '@/components/shared/chatSidebar';
import ChatWindow from '@/components/shared/chatWindow';

import { UserMinimal } from '@/types/types';
import { useExpertStore } from '@/store/expertStore';


const Chat = () => {
    const { expert } = useExpertStore()
    const expertId = expert?.id as string;
    const [selectedUser, setSelectedUser] = useState<UserMinimal | null>(null);

    return (
        <div className="min-h-screen bg-gray-100 mx-5 rounded-lg">
            <div className="h-screen flex rounded-lg">
                <ChatSidebar role={"Expert"} onSelectUser={setSelectedUser} selectedUserId={selectedUser?._id} />
                <ChatWindow role={"Expert"} selectedUser={selectedUser} currentUserId={expertId} />
            </div>
        </div>
    );
}

export default Chat;