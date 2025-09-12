"use client";

import { useState, useEffect } from "react";
import { DollarSign, Users, TrendingUp, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import payoutApi from "@/app/service/admin/payoutApi";

interface ExpertPayout {
    expertId: string;
    name: string;
    email: string;
    pendingAmount: number;
}

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<ExpertPayout[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingComplete, setProcessingComplete] = useState(false);
    const [lastPayoutDate, setLastPayoutDate] = useState<string | null>(null);

    //  Check if today is the first day of the month
    const isFirstDayOfMonth = () => {
        const today = new Date();
        return today.getDate() === 1;
    };

    //  Check if payouts have been processed this month
    const hasPayoutBeenProcessedThisMonth = () => {
        if (!lastPayoutDate) return false;
        const today = new Date();
        const lastPayout = new Date(lastPayoutDate);
        return lastPayout.getFullYear() === today.getFullYear() &&
            lastPayout.getMonth() === today.getMonth();
    };

    //  Determine if payout button should be shown
    const shouldShowPayoutButton = () => {
        return !hasPayoutBeenProcessedThisMonth() && payouts.length > 0;
    };

    const getCurrentMonthYear = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getNextPayoutDate = () => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    //  Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // fetch pending payouts
                const payoutsResponse = await payoutApi.getPendingPayouts();
                setPayouts(payoutsResponse.data || []);
                // fetch last payout date
                const dateResponse = await payoutApi.getLastPayoutDate();
                if (dateResponse?.data?.lastPayoutDate) {
                    setLastPayoutDate(dateResponse.data.lastPayoutDate);
                }
            } catch (err) {
                console.error("Error fetching payout data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPending = payouts.reduce((sum, payout) => sum + payout.pendingAmount, 0);
    const expertsCount = payouts.length;

    //  Run payouts
    const handleRunPayouts = async () => {
        setLoading(true);
        setProcessingComplete(false);
        try {
            await payoutApi.payouts(); // run payouts API
            setProcessingComplete(true);
            // refresh payouts
            const payoutsResponse = await payoutApi.getPendingPayouts();
            setPayouts(payoutsResponse.data || []);
            const dateResponse = await payoutApi.getLastPayoutDate();
            if (dateResponse?.data?.lastPayoutDate) {
                setLastPayoutDate(dateResponse.data.lastPayoutDate);
            }
        } catch (err) {
            console.error("Error running payouts:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                    <FaMoneyCheckAlt className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Expert Payouts</h1>
                                    <p className="text-white/80 mt-1 text-md">Manage and process monthly payments to platform experts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Payout Status Banner */}
                {isFirstDayOfMonth() && hasPayoutBeenProcessedThisMonth() && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                                <h4 className="text-sm font-semibold text-green-800">Payouts Already Processed</h4>
                                <p className="text-sm text-green-700">
                                    Monthly payouts for {getCurrentMonthYear()} have already been processed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isFirstDayOfMonth() && payouts.length > 0 && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-800">Next Payout Schedule</h4>
                                <p className="text-sm text-blue-700">
                                    Monthly payouts will be available for processing on {getNextPayoutDate()}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isFirstDayOfMonth() && payouts.length === 0 && !hasPayoutBeenProcessedThisMonth() && (
                    <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-gray-600 mr-3" />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800">No Pending Payouts</h4>
                                <p className="text-sm text-gray-700">
                                    There are currently no pending payouts. Next processing window: {getNextPayoutDate()}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="rounded-lg bg-white shadow-lg border-0 p-4">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Pending</p>
                                <p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow-lg border-0 p-4">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Experts Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{expertsCount}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg  bg-white shadow-lg border-0 p-4">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Payout</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{expertsCount > 0 ? Math.round(totalPending / expertsCount).toLocaleString() : '0'}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="rounded-lg  bg-white shadow-xl border-0">
                    <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className=" leading-none tracking-tight text-xl font-bold">Pending Payouts</h3>
                                <p className="text-blue-100 mt-1">Review and process expert payments</p>
                            </div>
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-white/20 text-white border-white/30">
                                {expertsCount} Pending
                            </div>
                        </div>
                    </div>

                    <div >
                        {payouts.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                                <p className="text-gray-600">No pending payouts at the moment.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Expert Details
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Pending Amount
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payouts.map((payout) => (
                                            <tr key={payout.expertId} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                                {payout.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">{payout.name}</div>
                                                            <div className="text-sm text-gray-500">Expert #{payout.expertId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{payout.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-lg font-bold text-gray-900">₹{payout.pendingAmount.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Button - Only show on first day of month if not processed */}
                {shouldShowPayoutButton() && (
                    <div className="mt-8 flex justify-center">
                        <button onClick={handleRunPayouts} disabled={loading}
                            className={`inline-flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-8 py-3 text-lg font-semibold transition-all duration-300 
                                ${processingComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} shadow-lg hover:shadow-xl transform hover:scale-105 text-white`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Processing Payouts...
                                </div>
                            ) : processingComplete ? (
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Payouts Processed Successfully!
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Run Monthly Payouts ({getCurrentMonthYear()})
                                </div>
                            )}
                        </button>
                    </div>
                )}

                {/* Status Banner */}
                {processingComplete && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                                <h4 className="text-sm font-semibold text-green-800">Payouts Completed Successfully</h4>
                                <p className="text-sm text-green-700">
                                    All {expertsCount} expert payouts totaling ₹{totalPending.toLocaleString()} have been processed for {getCurrentMonthYear()}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}