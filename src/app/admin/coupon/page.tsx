"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Calendar, Users, Percent, DollarSign, Tag } from 'lucide-react';
import { CouponModal } from '@/components/admin/CouponModal';
import { mockCoupons } from '@/lib/mockData';
import { Coupon } from '@/types/types';


const CouponManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[] | []>(mockCoupons as Coupon[]);
    const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>(mockCoupons as Coupon[]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterTarget, setFilterTarget] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    useEffect(() => {
        let filtered = [...coupons];
        if (searchTerm) {
            filtered = filtered.filter(coupon =>
                coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(coupon =>
                filterStatus === 'active' ? coupon.isActive : !coupon.isActive
            );
        }
        if (filterTarget !== 'all') {
            filtered = filtered.filter(coupon => coupon.target === filterTarget);
        }
        setFilteredCoupons(filtered);
    }, [coupons, searchTerm, filterStatus, filterTarget]);

    const handleCreateCoupon = (couponData: Omit<Coupon, '_id' | 'usedCount' | 'createdAt'>) => {
        const newCoupon: Coupon = {
            ...couponData,
            _id: Date.now().toString(),
            usedCount: 0,
            createdAt: new Date(),
        };
        setCoupons([newCoupon, ...coupons]);
        setShowCreateModal(false);
    };

    const handleEditCoupon = (couponData: Coupon) => {
        setCoupons(coupons.map(c => c._id === couponData._id ? couponData : c));
        setEditingCoupon(null);
    };

    const handleDeleteCoupon = (id: string) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            setCoupons(coupons.filter(c => c._id !== id));
        }
    };

    const handleToggleStatus = (id: string) => {
        setCoupons(coupons.map(c =>
            c._id === id ? { ...c, isActive: !c.isActive } : c
        ));
    };

    const formatDate = (date: Date | string): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getUsagePercentage = (used?: number, limit?: number): number => {
        if (!limit || !used) return 0;
        return Math.min((used / limit) * 100, 100);
    };

    const getTargetBadgeColor = (target: Coupon['target']): string => {
        const colors: Record<string, string> = {
            all: 'bg-blue-100 text-blue-800',
            new_joiners: 'bg-green-100 text-green-800',
            specific_users: 'bg-purple-100 text-purple-800',
            premium_users: 'bg-yellow-100 text-yellow-800',
            first_purchase: 'bg-pink-100 text-pink-800',
        };
        return colors[target] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-[#151231] rounded-lg shadow-sm p-6 flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Coupon Management</h1>
                            <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowCreateModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Coupon
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Tag className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                                    <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Tag className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {coupons.filter(c => c.isActive).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Uses</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {coupons.reduce((sum, c) => sum + (c.usedCount ?? 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Math.round(coupons.reduce((sum, c) => sum + c.discountValue, 0) / coupons.length)}
                                        {coupons[0]?.discountType === 'percentage' ? '%' : '$'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search coupons..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                                    />
                                </div>
                                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Targets</option>
                                    <option value="all">All Users</option>
                                    <option value="new_joiners">New Joiners</option>
                                    <option value="premium_users">Premium Users</option>
                                    <option value="first_purchase">First Purchase</option>
                                    <option value="specific_users">Specific Users</option>
                                </select>
                            </div>
                            <div className="text-sm text-gray-600">
                                Showing {filteredCoupons.length} of {coupons.length} coupons
                            </div>
                        </div>
                    </div>

                    {/* Coupons Table */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Code</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Discount</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Target</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Usage</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Expires</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCoupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center">
                                                        <span className="font-mono font-semibold text-gray-900">
                                                            {coupon.code}
                                                        </span>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(coupon.code)}
                                                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {coupon.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {coupon.discountType === 'percentage' ? (
                                                        <Percent className="w-4 h-4 text-green-600 mr-1" />
                                                    ) : (
                                                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                                                    )}
                                                    <span className="font-semibold text-green-600">
                                                        {coupon.discountValue}
                                                        {coupon.discountType === 'percentage' ? '%' : ''}
                                                    </span>
                                                </div>
                                                {coupon.minPurchaseAmount && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Min: ${coupon.minPurchaseAmount}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTargetBadgeColor(coupon.target)}`}>
                                                    {coupon.target.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                                                        </span>
                                                        {coupon.usageLimit && (
                                                            <span className="text-xs text-gray-500">
                                                                {Math.round(getUsagePercentage(coupon.usedCount, coupon.usageLimit))}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    {coupon.usageLimit && (
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.usageLimit)}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">
                                                        {formatDate(coupon.expiresAt)}
                                                    </span>
                                                </div>
                                                {new Date(coupon.expiresAt) < new Date() && (
                                                    <span className="text-xs text-red-600 mt-1 block">Expired</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleToggleStatus(coupon._id!)}
                                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors ${coupon.isActive
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => setEditingCoupon(coupon)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteCoupon(coupon._id!)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || editingCoupon) && (
                <CouponModal
                    coupon={editingCoupon}
                    onSave={editingCoupon ? handleEditCoupon : handleCreateCoupon}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCoupon(null);
                    }}
                />
            )}
        </div>
    );
};

export default CouponManagement;