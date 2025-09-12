import { useEffect } from 'react';
import { useSocketContext } from '@/context/socketContext';
import useConversation from '@/store/conversationStore';
import { useAuthStore } from '@/store/authStore';
import { useExpertStore } from '@/store/expertStore';
import { Message } from '@/types/types';

const useListenMessages = () => {
    const { socket } = useSocketContext() || {};
    const { addMessage, selectedConversation, incrementUnreadCount, setLastMessageMeta } = useConversation();
    const studentUser = useAuthStore((state) => state.user);
    const tutorUser = useExpertStore((state) => state.expert);
    const currentUserId = studentUser?.id || tutorUser?.id;

    useEffect(() => {
        if (!socket || !currentUserId) return;

        const handleNewMessage = (newMessage: Message) => {
            setLastMessageMeta({
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                message: newMessage.message || (newMessage.imageUrl ? '[Image]' : ''),
            });

            const otherUserId = newMessage.senderId === currentUserId ? newMessage.receiverId : newMessage.senderId;

            // If this message belongs to the currently opened chat
            if ((newMessage.senderId === selectedConversation?._id && newMessage.receiverId === currentUserId) ||
                (newMessage.receiverId === selectedConversation?._id && newMessage.senderId === currentUserId)) {
                addMessage(selectedConversation._id, newMessage);
            } else {
                // For other conversations, increment unread count
                incrementUnreadCount(newMessage.senderId);
                addMessage(otherUserId, newMessage);
            }
        };
        socket.on("newMessage", handleNewMessage);
        return () => { socket.off("newMessage", handleNewMessage); };
    }, [socket, currentUserId, selectedConversation, addMessage, incrementUnreadCount, setLastMessageMeta]);
};

export default useListenMessages;