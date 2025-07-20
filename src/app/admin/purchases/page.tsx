'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Package, IndianRupee } from 'lucide-react';
import { IOrder } from '@/types/types';
import { getItem, getOrders, getUser } from '@/app/service/admin/adminApi';
import { IItem, IOrderWithPopulated, IUser, OrderStats } from '@/types/orderTypes';
// import { useRouter } from 'next/navigation';

type FilterType = 'all' | 'paid' | 'unpaid' | 'pending' | 'failed';
type TypeFilter = 'all' | 'Course' | 'SubscriptionPlan';
type SortField = 'createdAt' | 'updatedAt' | 'amount';
type SortOrder = 'asc' | 'desc';

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<IOrderWithPopulated[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<FilterType>('all');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [sortBy, setSortBy] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    // const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getOrders()
                if (!response.status) {
                    throw new Error('Failed to fetch orders');
                }
                const ordersWithPopulatedData: IOrderWithPopulated[] = await Promise.all(
                    response.orders.map(async (order: IOrder) => {
                        const [userResponse, itemResponse] = await Promise.all([getUser(order.userId), getItem(order.itemId, order.type)]);
                        const user: IUser = userResponse.user;
                        let item: IItem;
                        if (order.type === "Course") {
                            item = itemResponse.course;
                        } else {
                            item = itemResponse.subscription;
                        }
                        return {
                            ...order,
                            userId: user,
                            itemId: item,
                            createdAt: new Date(order.createdAt),
                            updatedAt: new Date(order.updatedAt)
                        };
                    })
                );
                setOrders(ordersWithPopulatedData);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: IOrder['paymentStatus']): string => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'unpaid': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: IOrder['type']): string => {
        return type === 'Course'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800';
    };

    const formatCurrency = (amount: number, currency: string): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency || 'INR',
        }).format(amount);
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredOrders = orders.filter((order: IOrderWithPopulated) => {
        const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
        const matchesType = typeFilter === 'all' || order.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const sortedOrders = [...filteredOrders].sort((a: IOrderWithPopulated, b: IOrderWithPopulated) => {
        let aValue: string | number | Date;
        let bValue: string | number | Date;
        const valueA = a[sortBy as keyof IOrderWithPopulated];
        const valueB = b[sortBy as keyof IOrderWithPopulated];
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
            aValue = new Date(valueA as string);
            bValue = new Date(valueB as string);
        } else {
            aValue = valueA as string | number;
            bValue = valueB as string | number;
        }
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

    const stats: OrderStats = {
        total: orders.length,
        paid: orders.filter(o => o.paymentStatus === 'paid').length,
        pending: orders.filter(o => o.paymentStatus === 'pending').length,
        failed: orders.filter(o => o.paymentStatus === 'failed').length,
        totalRevenue: orders.filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + o.amount, 0)
    };

    const exportOrders = (): void => {
        const csv = [
            ['ID', 'User', 'Email', 'Item', 'Type', 'Amount', 'Currency', 'Status', 'Date'].join(','),
            ...filteredOrders.map(order => [
                order._id,
                order.userId.fullName,
                order.userId.email,
                order.title,
                order.type,
                order.amount,
                order.currency,
                order.paymentStatus,
                formatDate(order.createdAt)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleSortChange = (value: string): void => {
        const [field, order] = value.split('-') as [SortField, SortOrder];
        setSortBy(field);
        setSortOrder(order);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center rounded-lg">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
                    <p className="text-white">Loading orders...</p>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center rounded-lg">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700" >
                        Retry
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Orders Management</h1>
                                <p className="text-white/80 mt-1 text-md">Manage and track all customer orders</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="flex items-center">
                        <div className="p-2 bg-emerald-300 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-black">Total Orders</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-300 rounded-lg">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-black">Paid</p>
                            <p className="text-2xl font-bold text-white">{stats.paid}</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="flex items-center">
                        <div className="p-2 bg-amber-300 rounded-lg">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-black">Failed</p>
                            <p className="text-2xl font-bold text-white">
                                {stats.failed}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-300 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-black">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">
                                {formatCurrency(stats.totalRevenue, 'INR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search orders, users, or emails..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
                        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FilterType)}
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="unpaid">Unpaid</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
                        value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                    >
                        <option value="all">All Types</option>
                        <option value="Course">Course</option>
                        <option value="SubscriptionPlan">Subscription</option>
                    </select>

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10"
                        value={`${sortBy}-${sortOrder}`} onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>

                    <button onClick={exportOrders} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 h-10">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                </th>
                                <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="w-36 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                {/* <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th> */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 h-20">
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden">
                                        <div className="truncate">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                # {order._id.slice(-8)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden">
                                        <div className="ml-4 min-w-0 flex-1">
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {order.userId.fullName}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate">
                                                {order.userId.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate mb-1">
                                                {order.title}
                                            </div>
                                            <span className={`inline-flex px-2.5 py-1.5 text-xs font-semibold rounded-lg ${getTypeColor(order.type)}`}>
                                                {order.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {formatCurrency(order.amount, order.currency)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 overflow-hidden">
                                        {/* <div className="truncate"> */}
                                            {formatDate(order.createdAt)}
                                        {/* </div> */}
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => router.push(`/admin/orders/${order._id}`) } className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedOrders.length)} of {sortedOrders.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border rounded text-sm ${currentPage === pageNum
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
};

export default AdminOrdersPage;