"use client"

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { CouponModal } from '@/components/admin/CouponModal';
import { ICoupon } from '@/types/types';
import { couponStatus, createCoupon, deleteCoupon, fetchCoupon, updateCoupon } from '@/app/service/admin/adminApi';
import { Plus, Search, Edit2, Trash2, Copy, Calendar, Users, Percent, Tag, IndianRupee, Gift } from 'lucide-react';

const CouponManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<ICoupon[] | []>([]);
    const [filteredCoupons, setFilteredCoupons] = useState<ICoupon[] | []>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterTarget, setFilterTarget] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

    useEffect(() => {
        const getCoupons = async () => {
            const response = await fetchCoupon();
            if (response.status) {
                setCoupons(response.coupons);
            }
        };
        getCoupons();
    }, []);

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

    const handleCreateCoupon = async (couponData: Omit<ICoupon, '_id' | 'usedCount' | 'createdAt'>) => {
        try {
            const response = await createCoupon(couponData);
            if (response.status && response.coupon) {
                const newCoupon: ICoupon = response.coupon;
                setCoupons(prev => [newCoupon, ...prev]);
                setShowCreateModal(false);
                toast.success("create coupon successfully.");
            } else {
                toast.error("Failed to create coupon.");
            }
        } catch (error) {
            console.error("Failed to create coupon:", error);
            toast.error("An error occurred while creating coupon.");
        }
    };

    const handleEditCoupon = async (couponData: ICoupon) => {
        if (!couponData._id) {
            toast.error("Coupon ID is missing.");
            return;
        }
        try {
            const response = await updateCoupon(couponData._id, couponData);
            if (response.status) {
                setCoupons(coupons.map(c => c._id === response.coupon._id ? response.coupon : c));
                setEditingCoupon(null);
                toast.success("Update coupon successfully");
            }
        } catch (error) {
            console.error("Failed to update coupon:", error);
            toast.error("Failed to update coupon");
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this coupon?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await deleteCoupon(id);
                setCoupons(coupons.filter(c => c._id !== id));
                Swal.fire('Deleted!', 'The coupon has been deleted.', 'success');
            } catch (error) {
                console.error("Failed to delete coupon:", error);
                Swal.fire('Error!', 'Failed to delete the coupon.', 'error');
            }
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            const updated = await couponStatus(id);
            setCoupons(coupons.map(c => c._id === id ? updated : c));
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Coupon has been ${updated.isActive ? 'activated' : 'deactivated'}.`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to toggle coupon status:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update the coupon status.',
            });
        }
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

    const getTargetBadgeColor = (target: ICoupon['target']): string => {
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
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                    <Gift className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Coupon Management</h1>
                                    <p className="text-white/80 mt-1 text-md">Create and manage discount coupons</p>
                                </div>
                            </div>
                            <div className="relative flex items-center gap-1 mr-5">
                                <button onClick={() => setShowCreateModal(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Coupon
                                </button>
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
                                <Tag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">Total Coupons</p>
                                <p className="text-2xl font-bold text-white">{coupons.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-300 rounded-lg">
                                <Tag className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">Active Coupons</p>
                                <p className="text-2xl font-bold text-white">
                                    {coupons.filter(c => c.isActive).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="flex items-center">
                            <div className="p-2 bg-amber-300 rounded-lg">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-black">Total Uses</p>
                                <p className="text-2xl font-bold text-white">
                                    {coupons.reduce((sum, c) => sum + (c.usedCount ?? 0), 0)}
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
                                <p className="text-sm font-medium text-black">Avg. Discount</p>
                                <p className="text-2xl font-bold text-white">
                                    {Math.round(coupons.reduce((sum, c) => sum + c.discountValue, 0) / coupons.length) || 0}
                                    {coupons[0]?.discountType === 'percentage' ? '%' : '$'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 z-0"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 z-0"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input type="text" placeholder="Search coupons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                                />
                            </div>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                                className="px-3 py-2 border text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all" className='text-black'>All Status</option>
                                <option value="active" className='text-black'>Active</option>
                                <option value="inactive" className='text-black'>Inactive</option>
                            </select>
                            <select
                                value={filterTarget}
                                onChange={(e) => setFilterTarget(e.target.value)}
                                className="px-3 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all" className='text-black'>All Targets</option>
                                <option value="new_joiners" className='text-black'>New Joiners</option>
                                <option value="premium_users" className='text-black'>Premium Users</option>
                                <option value="first_purchase" className='text-black'>First Purchase</option>
                                <option value="specific_users" className='text-black'>Specific Users</option>
                            </select>
                        </div>
                        <div className="text-sm text-white">
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
                                {coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No coupons available.
                                        </td>
                                    </tr>
                                ) : filteredCoupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No coupons match your filters or search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCoupons.map((coupon) => (
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
                                                        <IndianRupee className="w-4 h-4 text-green-600 mr-1" />
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
                                    ))
                                )}
                            </tbody>
                        </table>
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