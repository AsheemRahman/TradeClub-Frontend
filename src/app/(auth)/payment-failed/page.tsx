"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, ArrowLeft, CreditCard, Mail, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import orderApi from "@/app/service/user/orderApi";
import { IOrder } from "@/types/types";


const PaymentFailedPage = () => {
    const [order, setOrder] = useState<IOrder | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = searchParams.get("session_id");
    const purchaseId = searchParams.get("courseId") || searchParams.get("planId");
    const isCourse = !!searchParams.get("courseId");

    useEffect(() => {
        if (sessionId && purchaseId) {
            const logFailedOrder = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await orderApi.createFailedOrder(sessionId);
                    if (response?.status) {
                        setOrder(response.order);
                        toast.info("Payment failed. No charges were made.");
                    } else {
                        setError(response?.message || "Failed to log the order. Please contact support.");
                        toast.error(response?.message || "Failed to log the order.");
                    }
                } catch (err) {
                    console.error("Error logging failed order:", err);
                    toast.error("Failed to log the order. Please contact support.");
                    setError("An error occurred while logging the failed order.");
                } finally {
                    setLoading(false);
                }
            };
            logFailedOrder();
        }
    }, [sessionId, purchaseId]);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            setIsRetrying(false);
            router.push("/profile");
        }, 1000);
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleGoBack = () => {
        router.push(isCourse ? "/courses" : "/subscriptions");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white/20 rounded-full p-3">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white text-center">Payment Failed</h1>
                        <p className="text-red-100 text-center mt-2">Don&apos;t worry, no charges were made</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6">
                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Order ID:</span>
                                    <span className="font-mono">{order?.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Item:</span>
                                    <span className="font-medium">{order?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(order?.amount ?? 0, order?.currency ?? "INR")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800 text-sm">
                                {error || "Your payment could not be processed. Please try again or contact support."}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying || loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                {isRetrying ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Retrying...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4" />
                                        <span>Try Again</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleGoBack}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Go Back</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-white rounded-2xl shadow-lg mt-6 overflow-hidden">
                    <div className="px-8 py-6">
                        <h3 className="font-semibold text-gray-900 mb-4 text-center">Need Help?</h3>
                        <div className="space-y-3">
                            <a
                                href={`mailto:tradeclub03@gmail.com`}
                                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                <span className="text-sm">tradeclub03@gmail.com</span>
                            </a>
                            <a
                                href={`tel:+918012345678`}
                                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                <span className="text-sm">+91 80 1234 5678</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Having trouble? Our support team is here to help 24/7</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
