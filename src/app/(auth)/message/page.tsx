"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Smile, Paperclip, Search, Plus,  Settings } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
    read?: boolean;
}

interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    isOnline: boolean;
    messages: Message[];
}

interface ChatAppProps {
    currentUser?: string;
}

const ChatApp: React.FC<ChatAppProps> = ({ currentUser = "You" }) => {
    const [activeChat, setActiveChat] = useState<string>('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [chats, setChats] = useState<Chat[]>([
        {
            id: '1',
            name: 'Alex Thompson',
            avatar: 'AT',
            lastMessage: 'That sounds exciting! I\'d love to hear more...',
            timestamp: new Date(Date.now() - 120000),
            unreadCount: 2,
            isOnline: true,
            messages: [
                {
                    id: '1',
                    text: 'Hey! How are you doing today?',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 300000),
                    read: true
                },
                {
                    id: '2',
                    text: 'I\'m doing great! Just working on some new projects. How about you?',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 240000),
                    read: true
                },
                {
                    id: '3',
                    text: 'That sounds exciting! I\'d love to hear more about what you\'re working on.',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 180000),
                    read: false
                },
                {
                    id: '4',
                    text: 'Sure! I\'m building a new chat interface with Next.js and TypeScript. It\'s been a really fun challenge.',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 120000),
                    read: false
                }
            ]
        },
        {
            id: '2',
            name: 'Sarah Chen',
            avatar: 'SC',
            lastMessage: 'Thanks for your help with the project!',
            timestamp: new Date(Date.now() - 3600000),
            unreadCount: 0,
            isOnline: true,
            messages: [
                {
                    id: '1',
                    text: 'Hi! Can you help me with the React component?',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 7200000),
                    read: true
                },
                {
                    id: '2',
                    text: 'Of course! What do you need help with?',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 7000000),
                    read: true
                },
                {
                    id: '3',
                    text: 'Thanks for your help with the project!',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 3600000),
                    read: true
                }
            ]
        },
        {
            id: '3',
            name: 'Design Team',
            avatar: 'DT',
            lastMessage: 'The new mockups look great 👍',
            timestamp: new Date(Date.now() - 86400000),
            unreadCount: 5,
            isOnline: false,
            messages: [
                {
                    id: '1',
                    text: 'Hey everyone! I\'ve uploaded the new design files.',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 90000000),
                    read: true
                },
                {
                    id: '2',
                    text: 'The new mockups look great 👍',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 86400000),
                    read: true
                }
            ]
        },
        {
            id: '4',
            name: 'Mike Johnson',
            avatar: 'MJ',
            lastMessage: 'See you at the meeting tomorrow',
            timestamp: new Date(Date.now() - 172800000),
            unreadCount: 0,
            isOnline: false,
            messages: [
                {
                    id: '1',
                    text: 'Don\'t forget about our meeting tomorrow at 2 PM',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 180000000),
                    read: true
                },
                {
                    id: '2',
                    text: 'See you at the meeting tomorrow',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 172800000),
                    read: true
                }
            ]
        },
        {
            id: '5',
            name: 'Emma Wilson',
            avatar: 'EW',
            lastMessage: 'Perfect! Let\'s schedule that call.',
            timestamp: new Date(Date.now() - 259200000),
            unreadCount: 1,
            isOnline: true,
            messages: [
                {
                    id: '1',
                    text: 'Are you available for a quick call this week?',
                    sender: 'other',
                    timestamp: new Date(Date.now() - 300000000),
                    read: true
                },
                {
                    id: '2',
                    text: 'Perfect! Let\'s schedule that call.',
                    sender: 'user',
                    timestamp: new Date(Date.now() - 259200000),
                    read: false
                }
            ]
        }
    ]);

    const activeChat2 = chats.find(chat => chat.id === activeChat);
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat2?.messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() && activeChat2) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputMessage,
                sender: 'user',
                timestamp: new Date(),
                read: true
            };

            setChats(prevChats =>
                prevChats.map(chat =>
                    chat.id === activeChat
                        ? {
                            ...chat,
                            messages: [...chat.messages, newMessage],
                            lastMessage: inputMessage,
                            timestamp: new Date()
                        }
                        : chat
                )
            );

            setInputMessage('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const ChatListItem: React.FC<{ chat: Chat }> = ({ chat }) => (
        <div
            onClick={() => setActiveChat(chat.id)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-gray-50 ${activeChat === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
        >
            <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${chat.isOnline
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                    {chat.avatar}
                </div>
                {chat.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{chat.name}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.timestamp)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
        const isUser = message.sender === 'user';

        return (
            <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {activeChat2?.avatar || 'U'}
                    </div>
                )}

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
                    <div className={`px-4 py-2 rounded-2xl shadow-sm ${isUser
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                        }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">
                        {formatTime(message.timestamp)}
                    </span>
                </div>

                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {currentUser.charAt(0)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-white mx-5 rounded-lg">
            {/* Sidebar - Chat List */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Sidebar Header */}
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Chats</h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map((chat) => (
                        <ChatListItem key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeChat2 ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${activeChat2.isOnline
                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                        }`}>
                                        {activeChat2.avatar}
                                    </div>
                                    {activeChat2.isOnline && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{activeChat2.name}</h3>
                                    <p className="text-sm text-green-500">
                                        {activeChat2.isOnline ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {activeChat2.messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-end gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                    <Paperclip className="w-5 h-5 text-gray-600" />
                                </button>

                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                                        <Smile className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
                            <p className="text-gray-600">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatApp;