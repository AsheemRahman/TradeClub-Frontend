"use client"

import React, { useState, useEffect } from 'react';
import { User, Search, CheckCircle, } from 'lucide-react';
import { ExpertCard } from '@/components/user/ExpertCard';
import { IExpert } from '@/types/bookingTypes';
import { getAllExpert } from '@/app/service/user/userApi';
import { toast } from 'react-toastify';


const TradingExpertBookingPage: React.FC = () => {
    const [experts, setExperts] = useState<IExpert[]>([]);
    const [filteredExperts, setFilteredExperts] = useState<IExpert[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMarket, setFilterMarket] = useState('all');
    const [filterStyle, setFilterStyle] = useState('all');
    const [filterExperience, setFilterExperience] = useState('all');

    const getExperts = async () => {
        try {
            const response = await getAllExpert();
            if (response.status && response.data.experts?.length) {
                setExperts(response.data.experts);
                setFilteredExperts(response.data.experts);
            } else {
                setExperts([]);
                setFilteredExperts([]);
            }
        } catch (error) {
            console.error("Error fetching expertData", error);
            toast.error("Failed to fetch expert data");
        }
    };

    useEffect(() => {
        getExperts();
    }, []);

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

    return (
        <div className="min-h-screen  mx-5 rounded-lg">
            {/* Hero Section */}
            <div className="relative z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-lg"></div>
                <div className="container mx-auto px-4 py-5">
                    <div className="text-center mb-4">
                        <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Trading Expert</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Connect with verified trading professionals for personalized guidance, advanced strategies, and accelerated growth in your trading journey
                        </p>
                        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Verified Experts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>1-on-1 Sessions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>Real-time Chat</span>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filter Section */}
                    <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2 ">Search Experts</label>
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10 pointer-events-none" />
                                <input type="text" placeholder="Name, market, or style..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Market Focus</label>
                                <select value={filterMarket} onChange={(e) => setFilterMarket(e.target.value)}
                                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    {marketOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trading Style</label>
                                <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)}
                                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    {styleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                                <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)}
                                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    {experienceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between relative">
                            <p className="text-sm text-gray-600">
                                {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Sort by:</span>
                                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>Highest Rated</option>
                                    <option>Most Reviews</option>
                                    <option>Lowest Price</option>
                                    <option>Most Experience</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experts Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    {filteredExperts.map((expert) => (
                        <ExpertCard key={expert.id} expert={expert} />
                    ))}
                </div>

                {filteredExperts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No trading experts found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria to find the perfect trading expert for you.</p>
                            <button onClick={() => { setSearchTerm(''); setFilterMarket('all'); setFilterStyle('all'); setFilterExperience('all'); }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 rounded-lg">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-gray-300">Expert Traders</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10k+</div>
                            <div className="text-gray-300">Sessions Completed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">4.8★</div>
                            <div className="text-gray-300">Average Rating</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-gray-300">Support Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingExpertBookingPage;