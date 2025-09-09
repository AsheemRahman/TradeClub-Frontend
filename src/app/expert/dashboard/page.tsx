'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { Calendar, Bell, Clock, MessageSquare, Settings, Users, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import expertApi from '@/app/service/expert/expertApi';
import { IExpert, IExpertVerification } from '@/types/expertTypes';
import { Button } from '@/components/ui/Button';
import sessionApi from '@/app/service/expert/sessionApi';
import { IDashboardStats, ISessionData } from '@/types/sessionTypes';

const ExpertDashboard = () => {
    const [expert, setExpert] = useState<IExpert | null>(null);
    const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null);
    const [sessionData, setSessionData] = useState<ISessionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('30d');
    const router = useRouter();

    // Function to check if expert should be redirected to verification
    const shouldRedirectToVerification = useCallback((expertData: IExpertVerification): boolean => {
        if (!expertData) return false;
        const requiredFields = ['experience_level', 'year_of_experience', 'markets_Traded', 'trading_style', 'DOB', 'state', 'country'];
        const hasIncompleteProfile = requiredFields.some(field => !expertData[field as keyof IExpertVerification]);
        const needsInitialVerification = !expertData.isVerified || expertData.isVerified === "";
        return hasIncompleteProfile || needsInitialVerification;
    }, []);

    const getExpert = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const expertData = await expertApi.getExpertData();
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

    const loadDashboardData = useCallback(async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                sessionApi.getDashboardStats(),
                sessionApi.getSessionAnalytics(analyticsPeriod),
            ]);
            setDashboardStats(statsRes.stats);
            setSessionData(analyticsRes.analytics);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }, [analyticsPeriod]);

    useEffect(() => {
        getExpert();
    }, [getExpert]);

    useEffect(() => {
        if (!isLoading && expert) {
            if (shouldRedirectToVerification(expert)) {
                router.push(`/expert/verification/?email=${expert.email}`);
            } else {
                loadDashboardData();
            }
        }
    }, [expert, isLoading, shouldRedirectToVerification, router, loadDashboardData]);

    useEffect(() => {
        if (expert && !shouldRedirectToVerification(expert)) {
            loadDashboardData();
        }
    }, [analyticsPeriod, expert, shouldRedirectToVerification, loadDashboardData]);

    const handleVerificationClick = useCallback(() => {
        if (expert?.email) {
            router.push(`/expert/verification/?email=${expert.email}`);
        }
    }, [expert?.email, router]);

    const handleQuickAction = useCallback((action: string) => {
        switch (action) {
            case 'messages':
                router.push("/expert/message");
                break;
            case 'schedule':
                router.push("/expert/session");
                break;
            case 'settings':
                router.push("/expert/profile");
                break;
        }
    }, [router]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

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
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5  mx-8">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden relative">
                                {expert.profilePicture ? (
                                    <Image src={expert.profilePicture} alt="Profile" fill className="rounded-full object-cover" />
                                ) : (
                                    <span>{expert.fullName?.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Welcome back, {expert.fullName || 'Expert'}! 👋</h1>
                                <p className="text-white/80 text-lg">Ready to inspire minds today?</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="relative p-2 text-white hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
                                <Bell className="w-5 h-5" />
                                {dashboardStats && dashboardStats.pendingMessages || 0 > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                        {dashboardStats?.pendingMessages}
                                    </span>
                                )}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Verification Banner */}
                {expert.isVerified !== "Approved" && (
                    <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
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

                {/* Stats Cards */}
                {dashboardStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total Students</p>
                                    <p className="text-2xl font-bold text-white">{dashboardStats.totalStudents}</p>
                                    <div className="flex items-center mt-1">
                                        {dashboardStats.monthlyGrowth > 0 ? (
                                            <ChevronUp className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={`text-sm ${dashboardStats.monthlyGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {Math.abs(dashboardStats.monthlyGrowth)}%
                                        </span>
                                    </div>
                                </div>
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total Sessions</p>
                                    <p className="text-2xl font-bold text-white">{dashboardStats.totalSessions}</p>
                                    <p className="text-sm text-gray-400">
                                        {dashboardStats.completionRate}% completion rate
                                    </p>
                                </div>
                                <BookOpen className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        {/* <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total Earnings</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(dashboardStats.totalEarnings)}</p>
                                    <p className="text-sm text-gray-400">This month</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-yellow-500" />
                            </div>
                        </div> */}

                        {/* <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Average Rating</p>
                                    <p className="text-2xl font-bold text-white">{dashboardStats.averageRating.toFixed(1)}</p>
                                    <div className="flex items-center mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(dashboardStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Star className="w-8 h-8 text-yellow-500" />
                            </div>
                        </div> */}
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Session Analytics */}
                    <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Session Analytics</h3>
                            <div className="flex space-x-2">
                                {(['7d', '30d', '90d'] as const).map((period) => (
                                    <button key={period} onClick={() => setAnalyticsPeriod(period)} className={`px-3 py-1 rounded-lg text-sm transition-colors ${analyticsPeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sessionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
                                    <Area type="monotone" dataKey="sessions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Sessions" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Earnings Chart */}
                    <div className="bg-[#151231] p-6 rounded-xl shadow-lg border border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-6">Earnings Overview</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sessionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} formatter={(value) => [formatCurrency(Number(value)), 'Earnings']} />
                                    <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} name="Earnings" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <button onClick={() => handleQuickAction('messages')} className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-800 transition-all text-left group" >
                            <MessageSquare className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Customer Messages</h3>
                            <p className="text-sm text-gray-600">Reply to customer inquiries and questions</p>
                            {dashboardStats && dashboardStats.pendingMessages || 0 > 0 && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {dashboardStats?.pendingMessages} pending
                                    </span>
                                </div>
                            )}
                        </button>
                        <button onClick={() => handleQuickAction('schedule')} className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-800 transition-all text-left group">
                            <Calendar className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Schedule Session</h3>
                            <p className="text-sm text-gray-600">Book a live teaching session with students</p>
                            {dashboardStats && dashboardStats.upcomingSessions > 0 && (
                                <div className="mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {dashboardStats.upcomingSessions} upcoming
                                    </span>
                                </div>
                            )}
                        </button>
                        <button onClick={() => handleQuickAction('settings')} className="bg-[#151231] p-6 rounded-xl shadow-sm border border-gray-800 hover:shadow-md hover:bg-gray-800 transition-all text-left group md:col-span-2 xl:col-span-1">
                            <Settings className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-300 mb-1">Account Profile</h3>
                            <p className="text-sm text-gray-600">Manage your profile and preferences</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDashboard;