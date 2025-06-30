import { useState } from "react";


export const CouponModal = ({ coupon, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        code: coupon?.code || '',
        description: coupon?.description || '',
        discountType: coupon?.discountType || 'percentage',
        discountValue: coupon?.discountValue || '',
        minPurchaseAmount: coupon?.minPurchaseAmount || '',
        usageLimit: coupon?.usageLimit || '',
        expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
        isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
        target: coupon?.target || 'all'
    });

    const handleSubmit = () => {
        ;
        const couponData = {
            ...formData,
            expiresAt: new Date(formData.expiresAt),
            discountValue: Number(formData.discountValue),
            minPurchaseAmount: formData.minPurchaseAmount ? Number(formData.minPurchaseAmount) : undefined,
            usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined
        };
        if (coupon) {
            couponData._id = coupon._id;
        }
        onSave(couponData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Coupon Code *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                placeholder="WELCOME20"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                placeholder="Describe this coupon..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type *
                                </label>
                                <select
                                    required
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
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
                                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
                                />
                            </div>
                        </div>

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
                                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Audience *
                            </label>
                            <select
                                required
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="new_joiners">New Joiners</option>
                                <option value="premium_users">Premium Users</option>
                                <option value="first_purchase">First Purchase</option>
                                <option value="specific_users">Specific Users</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Active immediately
                            </label>
                        </div>

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
                                {coupon ? 'Update' : 'Create'} Coupon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};