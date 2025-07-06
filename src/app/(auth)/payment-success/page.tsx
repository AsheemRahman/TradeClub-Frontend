"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Share2, ArrowRight, Sparkles, CreditCard, Mail, Calendar, Clock, Package, User } from 'lucide-react';

interface PaymentSuccessProps {
    transactionId?: string;
    amount?: string;
    currency?: string;
    customerEmail?: string;
    productName?: string;
    purchaseDate?: string;
    customerName?: string;
    paymentMethod?: string;
    onContinue?: () => void;
    onDownload?: () => void;
    onShare?: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    transactionId = "TXN-2025-789456123",
    amount = "149.99",
    currency = "USD",
    customerEmail = "customer@example.com",
    productName = "Premium Pro Subscription",
    purchaseDate = "July 3, 2025",
    customerName = "John Doe",
    paymentMethod = "**** 4242",
    onContinue,
    onDownload,
    onShare
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [detailsAnimated, setDetailsAnimated] = useState(false);
    const [successAnimated, setSuccessAnimated] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setIsVisible(true), 100);
        const timer2 = setTimeout(() => setDetailsAnimated(true), 300);
        const timer3 = setTimeout(() => setSuccessAnimated(true), 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    const handleContinue = () => {
        if (onContinue) {
            onContinue();
        } else {
            window.location.href = '/profile';
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            console.log('Download receipt');
        }
    };

    const handleShare = () => {
        if (onShare) {
            onShare();
        } else {
            if (navigator.share) {
                navigator.share({
                    title: 'Payment Successful!',
                    text: `Successfully purchased ${productName}`,
                    url: window.location.href
                });
            }
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Floating particles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/50 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className={`w-full max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[80vh]">

                    {/* LEFT SIDE - Transaction Details */}
                    <div className={`transition-all duration-1000 transform ${detailsAnimated ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                        }`}>
                        <div className="relative h-full">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>

                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 h-full flex flex-col">
                                {/* Header */}
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <CreditCard className="w-8 h-8 text-blue-400" />
                                        Transaction Details
                                    </h2>
                                    <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                                </div>

                                {/* Transaction Info Cards */}
                                <div className="flex-1 space-y-6">
                                    {/* Amount Card */}
                                    <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl p-6 border border-emerald-400/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-300 text-sm mb-1">Total Amount</p>
                                                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {currency === 'USD' ? '$' : currency}{amount}
                                                </p>
                                            </div>
                                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-300 text-sm mb-1">Product</p>
                                                <p className="text-white font-semibold text-lg mb-2">{productName}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                    <span className="text-emerald-300 text-sm">Active License</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Customer</p>
                                                    <p className="text-white font-semibold">{customerName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">Email</p>
                                                    <p className="text-white font-mono text-sm">{customerEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method & Date */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                                <p className="text-gray-400 text-sm">Payment</p>
                                            </div>
                                            <p className="text-white font-semibold">{paymentMethod}</p>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="text-gray-400 text-sm">Date</p>
                                            </div>
                                            <p className="text-white font-semibold">{purchaseDate}</p>
                                        </div>
                                    </div>

                                    {/* Transaction ID */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-400 text-sm">Transaction ID</p>
                                        </div>
                                        <p className="text-white font-mono text-sm bg-white/10 px-3 py-2 rounded-lg inline-block">
                                            {transactionId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - Success Message */}
                    <div className={`transition-all duration-1000 delay-300 transform ${successAnimated ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                        }`}>
                        <div className="relative h-full flex flex-col justify-center">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 text-center">
                                {/* Success Icon */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        {/* Rotating rings */}
                                        <div className="absolute inset-0 w-32 h-32 border-4 border-emerald-400/30 rounded-full animate-spin-slow"></div>
                                        <div className="absolute inset-2 w-28 h-28 border-4 border-cyan-400/30 rounded-full animate-spin-slow-reverse"></div>

                                        {/* Main success icon */}
                                        <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                                            <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />
                                        </div>

                                        {/* Pulsing glow */}
                                        <div className="absolute inset-0 w-32 h-32 bg-emerald-400/40 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                </div>

                                {/* Success Message */}
                                <div className="mb-10">
                                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-6 animate-shimmer">
                                        Payment Successful!
                                    </h1>
                                    <div className="space-y-4">
                                        <p className="text-2xl text-gray-300 leading-relaxed">
                                            🎉 Congratulations!
                                        </p>
                                        <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto">
                                            Your payment has been processed successfully. Welcome to the premium experience! You&apos;ll receive access details via email shortly.
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-10 flex justify-center">
                                    <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-3">
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                        Transaction Completed
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4">
                                    <button
                                        onClick={handleContinue}
                                        className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-cyan-500 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center gap-4 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <span className="relative text-xl">Continue Your Journey</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative" />
                                    </button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleDownload}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                                        >
                                            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                                            <span>Receipt</span>
                                        </button>

                                        <button
                                            onClick={handleShare}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold py-4 px-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                                        >
                                            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Email Confirmation */}
                                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20 backdrop-blur-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-semibold mb-1">Confirmation Email Sent!</p>
                                            <p className="text-gray-300 text-sm">
                                                Receipt sent to <span className="text-cyan-300 font-semibold">{customerEmail}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 space-y-2">
                    <p className="text-gray-400">
                        Need assistance? Our support team is here to help 24/7
                    </p>
                    <p className="text-cyan-300 font-semibold">
                        support@company.com • 1-800-SUPPORT
                    </p>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        
        .animate-confetti {
          animation: confetti 3s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 6s linear infinite;
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default PaymentSuccess;