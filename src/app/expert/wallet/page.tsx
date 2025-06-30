"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Calendar, Filter, Search, Eye, EyeOff, IndianRupee } from 'lucide-react';
import { fetchWallet } from '@/app/service/expert/expertApi';
import { WalletData } from '@/types/expertTypes';


const ExpertWalletDashboard: React.FC = () => {
    const [walletData, setWalletData] = useState<WalletData>({
        balance: 0,
        totalEarnings: 0,
        totalWithdrawn: 0,
        lastTransactionAt: undefined,
        transactions: [],
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
    const [showBalance, setShowBalance] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetchWallet();
            if (response.status) {
                const details = response.walletDetails;
                setWalletData({
                    balance: details?.balance || 0,
                    totalEarnings: details?.totalEarnings || 0,
                    totalWithdrawn: details?.totalWithdrawn || 0,
                    lastTransactionAt: details?.lastTransactionAt,
                    transactions: details?.transactions || [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch wallet", error);
            setWalletData({
                balance: 0,
                totalEarnings: 0,
                totalWithdrawn: 0,
                lastTransactionAt: undefined,
                transactions: [],
            });
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredTransactions = walletData.transactions.filter(transaction => {
        const matchesSearch = transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || transaction.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <div className="min-h-screen mx-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Wallet className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white">Wallet Dashboard</h1>
                                    <p className="text-white/80 text-lg">Manage your earnings and transactions</p>
                                </div>
                            </div>
                            {/* <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20">
                                    <Download className="w-5 h-5" />
                                    Export
                                </button>
                                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg">
                                    <Plus className="w-5 h-5" />
                                    Add Funds
                                </button>
                            </div> */}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <IndianRupee className="w-6 h-6 text-white" />
                                </div>
                                <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                    {showBalance ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
                                </button>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">
                                ₹ {showBalance ? walletData.balance : '••••••'}
                            </div>
                            <p className="text-emerald-100">Available Balance</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm text-blue-100 bg-white/20 px-3 py-1 rounded-full">↗ 12%</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">
                                ₹ {walletData.totalEarnings}
                            </div>
                            <p className="text-blue-100">Total Earnings</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <TrendingDown className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm text-orange-100 bg-white/20 px-3 py-1 rounded-full">Lifetime</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">
                                ₹ {walletData.totalWithdrawn}
                            </div>
                            <p className="text-orange-100">Total Withdrawn</p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm text-purple-100 bg-white/20 px-3 py-1 rounded-full">Recent</span>
                            </div>
                            <div className="text-lg font-semibold text-white mb-2">
                                {walletData.lastTransactionAt ? formatDate(walletData.lastTransactionAt) : 'No transactions'}
                            </div>
                            <p className="text-purple-100">Last Transaction</p>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-[#151231] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
                    <div className="p-8 border-b border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                            <div className="flex items-center gap-2 text-white/60">
                                <span className="text-sm">Last 30 days</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                                <input type="text" placeholder="Search by order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'all' | 'credit' | 'debit')}
                                    className="pl-12 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none backdrop-blur-sm min-w-48"
                                >
                                    <option value="all" className="bg-slate-800">All Transactions</option>
                                    <option value="credit" className="bg-slate-800">Credits Only</option>
                                    <option value="debit" className="bg-slate-800">Debits Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wallet className="w-10 h-10 text-white/50" />
                                </div>
                                <p className="text-white/60 text-lg">No transactions found</p>
                                <p className="text-white/40 text-sm mt-2">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTransactions.map((transaction, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${transaction.type === 'credit'
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                {transaction.type === 'credit' ? (
                                                    <ArrowUpRight className="w-5 h-5" />
                                                ) : (
                                                    <ArrowDownLeft className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-lg">{transaction.orderId}</p>
                                                <p className="text-white/40 text-sm">
                                                    {formatDate(transaction.transactionDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-xl ${transaction.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {transaction.type === 'credit' ? '+' : '-'} ₹ {transaction.amount}
                                            </p>
                                            <p className={`text-sm mt-1 px-3 py-1 rounded-full inline-block 
                                                ${transaction.type === 'credit' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                                {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertWalletDashboard;