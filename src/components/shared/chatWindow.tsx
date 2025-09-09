import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, Trash2, CheckSquare, User } from 'lucide-react';
import { UserMinimal } from '@/types/types';
import chatApi from '@/app/service/shared/chatApi';
import useConversation from '@/store/conversationStore';
import useListenMessages from '@/app/hooks/messageHook';
import useListenDeleteMessages from '@/app/hooks/deletedHook';
import { useSocketContext } from '@/context/socketContext';
import Image from 'next/image';

interface ExtendedUserMinimal extends UserMinimal {
    isOnline?: boolean;
}

interface Message {
    _id: string;
    message: string;
    createdAt: string;
    senderId: string;
    receiverId: string;
    imageUrl?: string;
    isDeleted?: boolean;
    isRead?: boolean;
}

interface ChatWindowProps {
    role: string;
    selectedUser: ExtendedUserMinimal | null;
    currentUserId: string;
}

const CloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'your-cloud-name';

const ChatWindow: React.FC<ChatWindowProps> = ({ role, selectedUser, currentUserId }) => {
    const { getMessages, setMessages, addMessage, setLastMessageMeta, resetUnreadCount, } = useConversation();
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [visibleChars, setVisibleChars] = useState<{ [key: string]: number }>({});
    const { onlineUser = [] } = useSocketContext() || {};
    const MAX_MESSAGE_LENGTH = 3000;
    const INITIAL_CHARS = 1000;
    const CHARS_INCREMENT = 1000;

    const conversationId = selectedUser?._id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messages = conversationId ? getMessages(conversationId) : [];


    const inputRef = useRef<HTMLInputElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCountRef = useRef(messages.length);

    useListenMessages();
    useListenDeleteMessages();

    const truncateMessage = (message: string, messageId: string) => {
        const totalLength = message.length;
        if (totalLength <= INITIAL_CHARS) {
            return { truncated: message, needsReadMore: false, isFullyVisible: false };
        }
        const visibleLength = visibleChars[messageId] || INITIAL_CHARS;
        const truncated = message.substring(0, visibleLength) + (visibleLength < totalLength ? '...' : '');
        const needsReadMore = visibleLength < totalLength;
        const isFullyVisible = visibleLength >= totalLength;
        return { truncated, needsReadMore, isFullyVisible };
    };

    const handleReadMore = (messageId: string, messageLength: number) => {
        const messageContainer = messageContainerRef.current;
        const messageElement = document.getElementById(`message-${messageId}`);
        let scrollPositionBefore = 0;

        if (messageContainer && messageElement) {
            // Calculate the scroll position relative to the message element
            const messageRect = messageElement.getBoundingClientRect();
            const containerRect = messageContainer.getBoundingClientRect();
            scrollPositionBefore = messageContainer.scrollTop + (messageRect.top - containerRect.top);
        }

        setVisibleChars((prev) => {
            const currentVisible = prev[messageId] || INITIAL_CHARS;
            const newVisible = Math.min(currentVisible + CHARS_INCREMENT, messageLength);
            return { ...prev, [messageId]: newVisible };
        });

        // Restore scroll position after DOM update
        setTimeout(() => {
            if (messageContainer) {
                messageContainer.scrollTop = scrollPositionBefore;
            }
        }, 0);
    };

    const handleReadLess = (messageId: string) => {
        const messageContainer = messageContainerRef.current;
        const messageElement = document.getElementById(`message-${messageId}`);
        let scrollPositionBefore = 0;

        if (messageContainer && messageElement) {
            // Calculate the scroll position relative to the message element
            const messageRect = messageElement.getBoundingClientRect();
            const containerRect = messageContainer.getBoundingClientRect();
            scrollPositionBefore = messageContainer.scrollTop + (messageRect.top - containerRect.top);
        }

        setVisibleChars((prev) => ({
            ...prev,
            [messageId]: INITIAL_CHARS,
        }));

        // Restore scroll position after DOM update
        setTimeout(() => {
            if (messageContainer) {
                messageContainer.scrollTop = scrollPositionBefore;
            }
        }, 0);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectMessage = (messageId: string) => {
        const message = messages.find((msg) => msg._id === messageId);
        if (message && message.senderId === currentUserId && !message.isDeleted) {
            if (selectedMessageIds.includes(messageId)) {
                setSelectedMessageIds(selectedMessageIds.filter((id) => id !== messageId));
            } else {
                setSelectedMessageIds([...selectedMessageIds, messageId]);
            }
        }
    };

    const handlesendMessage = async () => {
        if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;
        if (newMessage.length > MAX_MESSAGE_LENGTH) {
            alert(`Message exceeds the maximum length of ${MAX_MESSAGE_LENGTH} characters.`);
            return;
        }

        try {
            setIsLoading(true);
            let imageUrl = '';
            if (selectedImage) {
                const formData = new FormData();
                formData.append('file', selectedImage);
                formData.append('upload_preset', 'Chat_images');
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${CloudName}/image/upload`,{ method: 'POST', body: formData,});
                const uploadData = await uploadResponse.json();
                if (!uploadData.secure_url) throw new Error('Image upload failed');
                imageUrl = uploadData.secure_url;
            }
            setLastMessageMeta({
                senderId: currentUserId,
                receiverId: selectedUser._id,
                message: newMessage || (imageUrl ? '[Image]' : ''),
            });
            const response = await chatApi.sendMessage(selectedUser._id, newMessage, role, imageUrl);
            if (response?.success) {
                const tempMessage: Message = {
                    _id: response.data?._id || Date.now().toString(),
                    message: newMessage,
                    createdAt: new Date().toISOString(),
                    senderId: currentUserId,
                    receiverId: selectedUser._id,
                    ...(imageUrl && { imageUrl }),
                    isDeleted: false,
                    isRead: false,
                };
                addMessage(selectedUser._id, tempMessage);
                setNewMessage('');
                setSelectedImage(null);
                setImagePreview(null);
                await handleGetMessages();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessages = async () => {
        if (selectedMessageIds.length === 0 || !selectedUser) return;
        try {
            setIsLoading(true);
            const response = await chatApi.deleteMessages(selectedUser._id, selectedMessageIds);
            if (response?.success) {
                setSelectedMessageIds([]);
                setIsSelecting(false);
                await handleGetMessages();
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            } else {
                throw new Error('Failed to delete messages');
            }
        } catch (error) {
            console.error('Error deleting messages:', error);
            alert('Failed to delete messages. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetMessages = useCallback(async () => {
        if (!selectedUser) return;
        try {
            setIsLoading(true);
            const response = await chatApi.getMessages(selectedUser._id);
            if (response.success && Array.isArray(response.data)) {
                setMessages(selectedUser._id, response.data);
                await chatApi.markMessagesAsRead(selectedUser._id);
                resetUnreadCount(selectedUser._id);
            }
        } catch (error) {
            console.error('Error getting messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedUser, setMessages, resetUnreadCount]);

    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                console.warn('Invalid date value:', timestamp);
                return 'Invalid Date';
            }
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error('Error parsing timestamp:', error, 'Value:', timestamp);
            return 'Invalid Date';
        }
    };

    const isUserOnline = (userId: string) => {
        return Array.isArray(onlineUser) && onlineUser.includes(userId);
    };

    useEffect(() => {
        if (inputRef.current && selectedUser) {
            inputRef.current.focus();
        }
    }, [selectedUser]);

    useEffect(() => {
        // Only scroll to bottom if a new message is added
        if (messages.length > lastMessageCountRef.current) {
            const messageContainer = messageContainerRef.current;
            if (messageContainer) {
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }
        }
        lastMessageCountRef.current = messages.length;
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            handleGetMessages();
        }
    }, [selectedUser, handleGetMessages]);

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {selectedUser.profilePicture ? (
                        <Image src={selectedUser.profilePicture} alt={selectedUser.fullName} width={40} height={40} className="w-10 h-10 rounded-full" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                            {selectedUser.fullName ? selectedUser.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedUser.fullName}</h3>
                        <p className={`text-sm ${isUserOnline(selectedUser._id) ? 'text-green-500' : 'text-gray-500'}`}>
                            {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isSelecting ? (
                        <>
                            <button  onClick={handleDeleteMessages} disabled={isLoading || selectedMessageIds.length === 0} title="Delete selected messages"
                                className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Trash2 className="w-5 h-5" />
                                {selectedMessageIds.length > 0 && (
                                    <span className="ml-2 text-sm">{selectedMessageIds.length}</span>
                                )}
                            </button>
                            <button onClick={() => { setIsSelecting(false); setSelectedMessageIds([]);}}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsSelecting(true)} title="Select messages" className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center">
                            <CheckSquare className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div  id="message-container" ref={messageContainerRef}  className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50" >
                {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <p className="text-gray-500">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <p className="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isReceivedMessage = message.receiverId === currentUserId;
                        const isDeleted = message.isDeleted || false;
                        const { truncated, needsReadMore, isFullyVisible } = truncateMessage(message.message, message._id);

                        return (
                            <div key={message._id} id={`message-${message._id}`} className={`flex ${isReceivedMessage ? 'justify-start' : 'justify-end'} items-center`}>
                                {isSelecting && !isDeleted && message.senderId === currentUserId && (
                                    <input  type="checkbox" checked={selectedMessageIds.includes(message._id)}  onChange={() => handleSelectMessage(message._id)}  className="mr-2"/>
                                )}
                                <div  className={`max-w-[70%] rounded-2xl px-4 py-2 ${isReceivedMessage ? 'bg-white border border-gray-200' : 'bg-indigo-600 text-white' } ${isDeleted ? 'opacity-50' : ''}`}
                                    style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                                >
                                    {isDeleted ? (
                                        <p className={isReceivedMessage ? 'text-gray-500 italic' : 'text-white italic'}>
                                            Message is deleted
                                        </p>
                                    ) : (
                                        <>
                                            {message.imageUrl && (
                                                <Image src={message.imageUrl} alt="Shared image" className="max-w-full rounded-lg mb-2" />
                                            )}
                                            {message.message && (
                                                <>
                                                    <p className={isReceivedMessage ? 'text-gray-900' : 'text-white'}>
                                                        {truncated}
                                                    </p>
                                                    {(needsReadMore || isFullyVisible) && (
                                                        <button onClick={() => isFullyVisible ? handleReadLess(message._id) : handleReadMore(message._id, message.message.length)}
                                                            className={`text-sm mt-1 ${isReceivedMessage ? 'text-indigo-600' : 'text-indigo-200'} focus:outline-none`}
                                                        >
                                                            {isFullyVisible ? 'Show less' : 'Show more'}
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <p className={`text-xs mt-1 ${isReceivedMessage ? 'text-gray-500' : 'text-indigo-200'}`}>
                                                    {formatTime(message.createdAt)}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-white">
                {imagePreview && (
                    <div className="mb-4">
                        <Image src={imagePreview} alt="Preview" className="max-w-[200px] rounded-lg" />
                        <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="mt-2 text-sm text-red-500">
                            Remove Image
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-4">
                    <label className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isLoading} />
                    </label>
                    <div className="flex-1 relative">
                        <input ref={inputRef} type="text" value={newMessage}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                                    setNewMessage(e.target.value);
                                }
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handlesendMessage()}
                            placeholder="Type your message..."
                            className="w-full px-4 py-2 border text-gray-700 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {newMessage.length}/{MAX_MESSAGE_LENGTH} characters
                        </p>
                    </div>
                    <button className={`p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center relative ${isLoading ? 'opacity-75 cursor-not-allowed' : '' }`}
                        onClick={handlesendMessage} disabled={isLoading}
                    >
                        {isLoading && (
                            <span className="absolute w-full h-full rounded-full border-4 border-indigo-600 border-t-purple-300 animate-spin"></span>
                        )}
                        <Send className="w-5 h-5 z-10" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;