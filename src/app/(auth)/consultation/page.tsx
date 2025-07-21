"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle, Star, User, Search, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import Image from 'next/image';

interface Expert {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    isVerified: "Approved" | "Pending" | "Declined";
    isActive: boolean;
    profilePicture?: string;
    DOB?: Date;
    state?: string;
    country?: string;
    experience_level: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience: number;
    markets_Traded: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
    createdAt: Date;
    updatedAt: Date;
    // Additional fields for display
    rating?: number;
    reviews?: number;
    hourlyRate?: number;
    bio?: string;
    isOnline?: boolean;
}

// interface ExpertAvailability {
//     _id: string;
//     expertId: string;
//     date: string;
//     startTime: string;
//     endTime: string;
//     isBooked: boolean;
// }

const TradingExpertBookingPage: React.FC = () => {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
    // const [availability, setAvailability] = useState<ExpertAvailability[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMarket, setFilterMarket] = useState('all');
    const [filterStyle, setFilterStyle] = useState('all');
    const [filterExperience, setFilterExperience] = useState('all');

    // Mock data based on your schema
    const mockExperts: Expert[] = [
        {
            _id: '1',
            fullName: 'Sarah Chen',
            email: 'sarah.chen@trading.com',
            phoneNumber: '+1-555-0123',
            isVerified: 'Approved',
            isActive: true,
            profilePicture: '/api/placeholder/100/100',
            state: 'California',
            country: 'USA',
            experience_level: 'Expert',
            year_of_experience: 8,
            markets_Traded: 'Forex',
            trading_style: 'Swing Trading',
            createdAt: new Date(),
            updatedAt: new Date(),
            rating: 4.9,
            reviews: 127,
            hourlyRate: 150,
            bio: 'Forex trading expert specializing in swing trading strategies with consistent profit track record.',
            isOnline: true
        },
        {
            _id: '2',
            fullName: 'Marcus Rodriguez',
            email: 'marcus.r@trading.com',
            phoneNumber: '+1-555-0124',
            isVerified: 'Approved',
            isActive: true,
            profilePicture: '/api/placeholder/100/100',
            state: 'New York',
            country: 'USA',
            experience_level: 'Expert',
            year_of_experience: 12,
            markets_Traded: 'Crypto',
            trading_style: 'Day Trading',
            createdAt: new Date(),
            updatedAt: new Date(),
            rating: 4.8,
            reviews: 89,
            hourlyRate: 180,
            bio: 'Cryptocurrency day trading specialist with deep market analysis skills and risk management expertise.',
            isOnline: false
        },
        {
            _id: '3',
            fullName: 'Emily Johnson',
            email: 'emily.j@trading.com',
            phoneNumber: '+1-555-0125',
            isVerified: 'Approved',
            isActive: true,
            profilePicture: '/api/placeholder/100/100',
            state: 'Texas',
            country: 'USA',
            experience_level: 'Intermediate',
            year_of_experience: 5,
            markets_Traded: 'Stock',
            trading_style: 'Position Trading',
            createdAt: new Date(),
            updatedAt: new Date(),
            rating: 4.7,
            reviews: 156,
            hourlyRate: 120,
            bio: 'Stock market position trader focusing on fundamental analysis and long-term investment strategies.',
            isOnline: true
        },
        {
            _id: '4',
            fullName: 'David Kim',
            email: 'david.k@trading.com',
            phoneNumber: '+1-555-0126',
            isVerified: 'Approved',
            isActive: true,
            profilePicture: '/api/placeholder/100/100',
            state: 'Illinois',
            country: 'USA',
            experience_level: 'Expert',
            year_of_experience: 15,
            markets_Traded: 'Commodities',
            trading_style: 'Scalping',
            createdAt: new Date(),
            updatedAt: new Date(),
            rating: 4.9,
            reviews: 92,
            hourlyRate: 200,
            bio: 'Commodities scalping expert with advanced technical analysis skills and high-frequency trading experience.',
            isOnline: true
        }
    ];

    // const mockAvailability: ExpertAvailability[] = [
    //     { _id: '1', expertId: '1', date: '2025-07-23', startTime: '09:00', endTime: '10:00', isBooked: false },
    //     { _id: '2', expertId: '1', date: '2025-07-23', startTime: '10:00', endTime: '11:00', isBooked: true },
    //     { _id: '3', expertId: '1', date: '2025-07-23', startTime: '14:00', endTime: '15:00', isBooked: false },
    //     { _id: '4', expertId: '1', date: '2025-07-24', startTime: '09:00', endTime: '10:00', isBooked: false },
    //     { _id: '5', expertId: '2', date: '2025-07-23', startTime: '11:00', endTime: '12:00', isBooked: false },
    //     { _id: '6', expertId: '2', date: '2025-07-23', startTime: '15:00', endTime: '16:00', isBooked: false },
    // ];

    const marketOptions = [
        { value: 'all', label: 'All Markets' },
        { value: 'Stock', label: 'Stock Market' },
        { value: 'Forex', label: 'Forex Trading' },
        { value: 'Crypto', label: 'Cryptocurrency' },
        { value: 'Commodities', label: 'Commodities' }
    ];

    const styleOptions = [
        { value: 'all', label: 'All Styles' },
        { value: 'Scalping', label: 'Scalping' },
        { value: 'Day Trading', label: 'Day Trading' },
        { value: 'Swing Trading', label: 'Swing Trading' },
        { value: 'Position Trading', label: 'Position Trading' }
    ];

    const experienceOptions = [
        { value: 'all', label: 'All Levels' },
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Expert', label: 'Expert' }
    ];

    useEffect(() => {
        // In real app, these would be API calls
        setExperts(mockExperts);
        // setAvailability(mockAvailability);
        setFilteredExperts(mockExperts);
    }, []);

    useEffect(() => {
        let filtered = experts.filter(expert => expert.isVerified === 'Approved' && expert.isActive);
        if (searchTerm) {
            filtered = filtered.filter(expert =>
                expert.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.markets_Traded.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.trading_style.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterMarket !== 'all') {
            filtered = filtered.filter(expert => expert.markets_Traded === filterMarket);
        }
        if (filterStyle !== 'all') {
            filtered = filtered.filter(expert => expert.trading_style === filterStyle);
        }
        if (filterExperience !== 'all') {
            filtered = filtered.filter(expert => expert.experience_level === filterExperience);
        }
        setFilteredExperts(filtered);
    }, [searchTerm, filterMarket, filterStyle, filterExperience, experts]);

    const getMarketIcon = (market: string) => {
        switch (market) {
            case 'Stock': return <TrendingUp className="w-4 h-4" />;
            case 'Forex': return <DollarSign className="w-4 h-4" />;
            case 'Crypto': return <BarChart3 className="w-4 h-4" />;
            case 'Commodities': return <BarChart3 className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    const handleBooking = (expertId: string) => {
        console.log("click chat", expertId)
    }

    const handleChat = (expertId: string) => {
        console.log("click chat", expertId)
    }

    const ExpertCard = ({ expert }: { expert: Expert }) => (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="relative">
                    <Image src={expert.profilePicture || '/api/placeholder/100/100'} alt={expert.fullName} fill className="w-16 h-16 rounded-full object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${expert.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.fullName}</h3>
                    <p className="text-gray-600 mb-1">{expert.experience_level} Trader</p>

                    <div className="flex items-center gap-2 mb-2">
                        {getMarketIcon(expert.markets_Traded)}
                        <span className="text-sm font-medium text-blue-600">{expert.markets_Traded}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{expert.trading_style}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{expert.rating || 0}</span>
                            <span className="text-gray-500 text-sm">({expert.reviews || 0})</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                            ${expert.hourlyRate || 0}/hr
                        </div>
                        <div className="text-sm text-gray-600">
                            {expert.year_of_experience}+ years
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{expert.bio}</p>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {expert.state}, {expert.country}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${expert.isVerified === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {expert.isVerified}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => { handleBooking(expert._id) }}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Book Session
                        </button>
                        <button onClick={() => { handleChat(expert._id) }}
                            className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Find Your Trading Expert</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Connect with verified trading professionals for personalized guidance and strategies
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Search experts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 text-white pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select value={filterMarket} onChange={(e) => setFilterMarket(e.target.value)} className="px-4 py-3 text-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {marketOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className="px-4 py-3 text-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {styleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} className="px-4 py-3 text-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {filteredExperts.map((expert) => (
                        <ExpertCard key={expert._id} expert={expert} />
                    ))}
                </div>
                {filteredExperts.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No trading experts found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradingExpertBookingPage;