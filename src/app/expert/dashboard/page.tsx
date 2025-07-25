'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { Calendar, Bell, Clock, MessageSquare, Settings, } from 'lucide-react';
import { getExpertData } from '@/app/service/expert/expertApi';
import { IExpert, IExpertVerification } from '@/types/expertTypes';
import { Button } from '@/components/ui/Button';


const ExpertDashboard = () => {
    const [expert, setExpert] = useState<IExpert | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Function to check if expert should be redirected to verification
    const shouldRedirectToVerification = useCallback((expertData: IExpertVerification): boolean => {
        if (!expertData) return false;
        // Check if essential verification fields are missing
        const requiredFields = ['experience_level', 'year_of_experience', 'markets_Traded', 'trading_style', 'DOB', 'state', 'country'];
        // If any required field is missing, redirect to verification
        const hasIncompleteProfile = requiredFields.some(field => !expertData[field as keyof IExpertVerification]);
        // Also redirect if verification status is not set (new user)
        const needsInitialVerification = !expertData.isVerified || expertData.isVerified === "";
        return hasIncompleteProfile || needsInitialVerification;
    }, []);

    const getExpert = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const expertData = await getExpertData();
            if (expertData?.status && expertData?.expertDetails) {
                setExpert(expertData.expertDetails);
            } else {
                throw new Error('Failed to fetch expert data');
            }
        } catch (error) {
            console.error('Error fetching expert data:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Failed to load expert data');
            }
            router.replace("/expert/login");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        getExpert();
    }, [getExpert]);

    useEffect(() => {
        if (!isLoading && expert) {
            if (shouldRedirectToVerification(expert)) {
                router.push(`/expert/verification/?email=${expert.email}`);
            }
        }
    }, [expert, isLoading, shouldRedirectToVerification, router]);

    const handleVerificationClick = useCallback(() => {
        if (expert?.email) {
            router.push(`/expert/verification/?email=${expert.email}`);
        }
    }, [expert?.email, router]);

    const handleQuickAction = useCallback((action: string) => {
        switch (action) {
            case 'messages':
                router.push("/expert/messages");
                break;
            case 'schedule':
                router.push("/expert/schedule");
                break;
            case 'settings':
                router.push("/expert/settings");
                break;
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center mx-4 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-100">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={getExpert} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-100">No expert data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5 mb-4 mx-8 ">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden relative">
                                {expert.profilePicture ? (
                                    <Image src={expert.profilePicture} alt="Profile" fill className="rounded-full object-cover" />
                                ) : (
                                    <span>{expert.fullName?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Welcome back, {expert.fullName || 'Expert'}! 👋</h1>
                                <p className="text-white/80 text-lg">Ready to inspire minds today?</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="relative p-2 text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                            <Button onClick={() => router.push('/expert/profile')}>
                                Profile
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Verification Banner */}
                {expert.isVerified !== "Approved" && (
                    <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900 mb-1">
                                        Verification Status: {expert.isVerified || "Not Started"}
                                    </h3>
                                    <p className="text-amber-700 text-sm">
                                        {expert.isVerified === "Pending" ? "Your verification is under review. You'll be notified once approved."
                                            : expert.isVerified === "Declined"
                                                ? "Your verification was declined. Please resubmit your documents with the required information."
                                                : "Please complete your verification to access all features and start teaching."
                                        }
                                    </p>
                                </div>
                            </div>
                            {(expert.isVerified === "Declined" || !expert.isVerified) && (
                                <button onClick={handleVerificationClick}
                                    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium whitespace-nowrap"
                                >
                                    {expert.isVerified === "Declined" ? "Resubmit Documents" : "Complete Verification"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <button onClick={() => handleQuickAction('messages')}
                            className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-200  transition-all text-left group"
                        >
                            <MessageSquare className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Student Messages</h3>
                            <p className="text-sm text-gray-600">Reply to student inquiries and questions</p>
                        </button>
                        <button onClick={() => handleQuickAction('schedule')}
                            className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-200 transition-all text-left group"
                        >
                            <Calendar className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Schedule Session</h3>
                            <p className="text-sm text-gray-600">Book a live teaching session with students</p>
                        </button>
                        <button onClick={() => handleQuickAction('settings')}
                            className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-200 transition-all text-left group md:col-span-2 xl:col-span-1"
                        >
                            <Settings className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Account Settings</h3>
                            <p className="text-sm text-gray-600">Manage your profile and preferences</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDashboard;