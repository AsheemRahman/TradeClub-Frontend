import { Coupon } from "@/types/types";
import React, { useState } from "react";

type CouponModalProps = {
    coupon?: Coupon | null;
    onSave: (couponData: Coupon) => void;
    onClose: () => void;
};

export const CouponModal: React.FC<CouponModalProps> = ({ coupon, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        code: coupon?.code || "",
        description: coupon?.description || "",
        discountType: coupon?.discountType || "percentage",
        discountValue: coupon?.discountValue?.toString() || "",
        minPurchaseAmount: coupon?.minPurchaseAmount?.toString() || "",
        usageLimit: coupon?.usageLimit?.toString() || "",
        expiresAt: coupon?.expiresAt
            ? new Date(coupon.expiresAt).toISOString().split("T")[0]
            : "",
        isActive: coupon?.isActive ?? true,
        target: coupon?.target || "all",
    });

    const handleSubmit = () => {
        const couponData:Coupon = {
            ...formData,
            expiresAt: new Date(formData.expiresAt),
            discountValue: Number(formData.discountValue),
            minPurchaseAmount: formData.minPurchaseAmount
                ? Number(formData.minPurchaseAmount)
                : undefined,
            usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        };
        if (coupon?._id) couponData._id = coupon._id;
        onSave(couponData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {coupon ? "Edit Coupon" : "Create New Coupon"}
                    </h2>

                    <div className="space-y-4">
                        {/* Coupon Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coupon Code *
                            </label>
                            <input type="text" required value={formData.code} placeholder="WELCOME20"
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea value={formData.description} placeholder="Describe this coupon..." rows={2}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Discount Type and Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type *
                                </label>
                                <select required value={formData.discountType}
                                    onChange={(e) =>
                                        setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Value *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                                    value={formData.discountValue}
                                    onChange={(e) =>
                                        setFormData({ ...formData, discountValue: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={formData.discountType === "percentage" ? "20" : "10.00"}
                                />
                            </div>
                        </div>

                        {/* Min Purchase Amount & Usage Limit */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Purchase Amount
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.minPurchaseAmount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, minPurchaseAmount: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Usage Limit
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.usageLimit}
                                    onChange={(e) =>
                                        setFormData({ ...formData, usageLimit: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Audience *
                            </label>
                            <select required value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value as "all" | "new_joiners" | "specific_users" | "premium_users" | "first_purchase" })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="new_joiners">New Joiners</option>
                                <option value="premium_users">Premium Users</option>
                                <option value="first_purchase">First Purchase</option>
                                <option value="specific_users">Specific Users</option>
                            </select>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date *
                            </label>
                            <input type="date" required value={formData.expiresAt} min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Active Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.target.checked })
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Active immediately
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {coupon ? "Update" : "Create"} Coupon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
