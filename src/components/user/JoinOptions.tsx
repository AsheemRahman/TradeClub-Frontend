"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TradeClubHero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen  text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-6 py-16 min-h-screen flex flex-col justify-center">
                {/* Main Title */}
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        TradeClub
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your gateway to professional trading success
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

                    {/* Customer Card */}
                    <div className={`group relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">For Traders</h2>
                                </div>
                            </div>

                            {/* Card Image */}
                            <div className="relative mb-6 overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                <div className="aspect-video bg-gradient-to-br from-orange-400/20 to-red-500/20 flex items-center justify-center">
                                    <Image src="/images/expert-login1.jpg" fill alt="Trading expert professional man in suit" className="object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-orange-400">Become a Customer</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Join TradeClub to level up your trading game. Gain access to expert insights,
                                    personalized guidance, and a thriving community designed to help you grow your skills
                                    and build confidence.
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Expert Insights', 'Community', 'Personalized Guidance'].map((feature) => (
                                        <span key={feature} className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <button onClick={() => router.push("/login")}
                                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/25 transform hover:scale-105"
                                >
                                    Start Trading Journey
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expert Card */}
                    <div className={`group relative transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">For Experts</h2>
                                </div>
                            </div>

                            {/* Card Image */}
                            <div className="relative mb-6 overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                <div className="aspect-video bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center">
                                    <Image src="/images/user-login.jpg" alt="Trading professional" fill className="object-cover"/>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-purple-400">Become an Expert</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    Turn your trading experience into impact. Share valuable insights, offer personalized
                                    guidance, and connect with learners while building your reputation and creating new
                                    income opportunities.
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Share Knowledge', 'Build Reputation', 'Earn Income'].map((feature) => (
                                        <span key={feature} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <button onClick={() => router.push("/expert/login")}
                                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25 transform hover:scale-105"
                                >
                                    Share Your Expertise
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-gray-400 mb-4">Ready to transform your trading journey?</p>
                    <div className="flex justify-center gap-4">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeClubHero;