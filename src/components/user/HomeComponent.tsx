"use client"

import React, { useState, useEffect } from "react";
import { ChevronRight, TrendingUp, Users, BookOpen, MessageCircle, Video, Bell, Shield, Award, } from "lucide-react";

export const HomeHero = () => {
    const [currentFeature, setCurrentFeature] = useState(0);
    // const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const features = [
        {
            title: "Expert-Led Trading",
            description: "Connect with verified trading experts through video calls and live chat",
            icon: Video,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Real-Time Alerts",
            description: "Get instant notifications on market opportunities and trade signals",
            icon: Bell,
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Learning Academy",
            description: "Master trading strategies with our comprehensive educational modules",
            icon: BookOpen,
            color: "from-green-500 to-emerald-500"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div className="relative min-h-screen  overflow-hidden border-b-1 border-gray-600">
            {/* Dynamic animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 transform rotate-45 animate-pulse opacity-60"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-green-400 transform rotate-45 animate-pulse opacity-60"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-16 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
                    {/* Left content */}
                    <div className="text-center lg:text-left">
                        {/* Status badge */}
                        <div className="inline-flex items-center bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-green-500/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm text-green-300 font-medium">Live Trading Platform</span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Trade Like a
                            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                Pro
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                            Join our comprehensive trading ecosystem with expert mentorship, real-time alerts,
                            interactive learning, and seamless communication tools.
                        </p>

                        {/* Dual CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
                                Start Trading Journey
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center group">
                                Join as Expert
                                <Shield className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Feature showcase */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${features[currentFeature].color} mr-4`}>
                                    {/* <features [currentFeature].icon className="w-6 h-6 text-white" /> */}
                                    {React.createElement(features[currentFeature].icon, { className: "w-6 h-6 text-white" })}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">{features[currentFeature].title}</h3>
                                    <p className="text-white/70 text-sm">{features[currentFeature].description}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {features.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === currentFeature ? 'bg-cyan-400 w-8' : 'bg-white/30 w-2'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right content - Enhanced Dashboard */}
                    <div className="relative">
                        {/* Main dashboard */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-white font-semibold text-lg">Trading Dashboard</h3>
                                    <p className="text-white/60 text-sm">Real-time market insights</p>
                                </div>
                                <div className="flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                    <span className="text-green-300 text-sm font-medium">Live</span>
                                </div>
                            </div>

                            {/* Portfolio performance */}
                            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-4 mb-6 border border-green-500/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/70 text-sm">Portfolio Value</p>
                                        <p className="text-2xl font-bold text-white">$24,847.32</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-green-400 mb-1">
                                            <TrendingUp className="w-5 h-5 mr-1" />
                                            <span className="font-bold">+24.7%</span>
                                        </div>
                                        <p className="text-white/60 text-sm">This month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Active positions */}
                            <div className="space-y-3 mb-6">
                                <h4 className="text-white font-medium mb-3">Active Positions</h4>
                                {[
                                    { symbol: "AAPL", change: "+2.4%", price: "$184.32", status: "BUY", color: "text-green-400" },
                                    { symbol: "TSLA", change: "+5.7%", price: "$251.23", status: "HOLD", color: "text-green-400" },
                                    { symbol: "NVDA", change: "+8.2%", price: "$486.79", status: "BUY", color: "text-green-400" }
                                ].map((stock, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                                                {stock.symbol.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">{stock.symbol}</div>
                                                <div className="text-white/60 text-xs">{stock.price}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold ${stock.color} text-sm`}>{stock.change}</div>
                                            <div className="text-xs text-white/60">{stock.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
                                    <Video className="w-4 h-4 mr-2" />
                                    Expert Call
                                </button>
                                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat
                                </button>
                            </div>
                        </div>

                        {/* Floating notification */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-4 shadow-lg animate-bounce max-w-xs">
                            <div className="flex items-center mb-2">
                                <Bell className="w-5 h-5 text-white mr-2" />
                                <span className="text-white font-semibold text-sm">Trade Alert</span>
                            </div>
                            <p className="text-white/90 text-xs">AAPL showing strong bullish pattern. Consider entry at $182.</p>
                        </div>

                        {/* Floating learning badge */}
                        <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full p-4 shadow-lg animate-pulse">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>

                        {/* Floating expert badge */}
                        <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-3 shadow-lg">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Feature highlights bar */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { icon: Users, title: "Dual Access", desc: "Traders & Experts" },
                        { icon: Bell, title: "Real-time Alerts", desc: "Instant Notifications" },
                        { icon: BookOpen, title: "Learning Hub", desc: "Trading Strategies" },
                        { icon: MessageCircle, title: "Communication", desc: "Chat & Video Calls" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                            <p className="text-white/70 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};