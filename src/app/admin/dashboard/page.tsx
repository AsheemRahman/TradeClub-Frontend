"use client"

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, BookOpen, TrendingUp, Calendar, Bell, Settings, IndianRupee } from "lucide-react";

import { getCourse } from "@/app/service/admin/courseApi";
import { getRevenue } from "@/app/service/admin/adminApi";
import { ICourse } from "@/types/courseTypes";

const COLORS = ['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#eab308'];

interface ICourseWithStats extends ICourse {
    customers: number;
    color: string;
}

interface IRevenue {
    month: string;
    revenue: number;
    customers: number;
}


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [revenueData, setRevenueData] = useState<IRevenue[]>([]);
    const [courseData, setCourseData] = useState<ICourseWithStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [revenueRes, coursesRes] = await Promise.all([
                    getRevenue(),
                    getCourse()
                ]);
                const coursesWithStats = coursesRes.courses.map((course: ICourse, index: number) => ({
                    ...course,
                    customers: course.purchasedUsers?.length || 0,
                    color: COLORS[index % COLORS.length],
                }));
                setRevenueData(revenueRes.revenue);
                setCourseData(coursesWithStats);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>;
    }
    // Calculate latest revenue and growth
    const latestRevenue = revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue : 0;
    const previousRevenue = revenueData.length > 1 ? revenueData[revenueData.length - 2].revenue : 0;
    const growthPercentage = previousRevenue > 0 ? (((latestRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2) : "0";

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-6 mb-6">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                                <p className="text-white/80 mt-1 text-lg">Manage your Chat, Wallet, and Monthly revenue</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                                <Bell className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                                <Settings className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">1,234</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+12% last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-lg">
                            <Users className="w-8 h-8 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Experts</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">872</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+8% last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                ₹{latestRevenue.toLocaleString()}
                            </p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className={`w-4 h-4 ${Number(growthPercentage) >= 0 ? "text-green-500" : "text-red-500"} mr-1`} />
                                <span className={`text-sm ${Number(growthPercentage) >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {Number(growthPercentage) >= 0 ? "+" : ""}
                                    {growthPercentage}% last month
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <IndianRupee className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Courses</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{courseData.length}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+2 new courses</span>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['overview', 'revenue', 'courses'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Chart Sections */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Course Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={courseData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="customers" nameKey="title">
                                    {courseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Customers</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis yAxisId="left" stroke="#6b7280" />
                                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollment</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={courseData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="title" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                <Bar dataKey="customers" radius={[4, 4, 0, 0]}>
                                    {courseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}