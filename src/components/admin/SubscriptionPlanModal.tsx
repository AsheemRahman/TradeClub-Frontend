import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { IAccessLevel, ISubscriptionFormData, ISubscriptionPlan } from '@/types/subscriptionTypes';
import { toast } from 'react-toastify';

interface SubscriptionPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: ISubscriptionFormData) => void;
    editingPlan?: ISubscriptionPlan | null;
    loading?: boolean;
}

const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({ isOpen, onClose, onSubmit, editingPlan, loading = false }) => {
    const [formData, setFormData] = useState<ISubscriptionFormData>({
        name: '',
        price: '',
        duration: '',
        features: [],
        accessLevel: {
            expertCallsPerMonth: 0,
            videoAccess: false,
            chatSupport: false
        },
        isActive: true
    });
    const [newFeature, setNewFeature] = useState<string>('');

    // Reset form when modal opens/closes or editing plan changes
    useEffect(() => {
        if (isOpen) {
            if (editingPlan) {
                setFormData({
                    name: editingPlan.name,
                    price: editingPlan.price.toString(),
                    duration: editingPlan.duration.toString(),
                    features: [...editingPlan.features],
                    accessLevel: { ...editingPlan.accessLevel },
                    isActive: editingPlan.isActive
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingPlan]);

    const resetForm = (): void => {
        setFormData({
            name: '',
            price: '',
            duration: '',
            features: [],
            accessLevel: {
                expertCallsPerMonth: 0,
                videoAccess: false,
                chatSupport: false
            },
            isActive: true
        });
        setNewFeature('');
    };

    const handleSubmit = async (): Promise<void> => {
        if (!formData.name.trim() || !formData.price || !formData.duration.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }
        // Prevent double submission
        if (loading) return;
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = (): void => {
        // Prevent closing while loading
        if (loading) return;
        resetForm();
        onClose();
    };

    const addFeature = (): void => {
        // Disable adding features while loading
        if (loading) return;
        if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
            setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
            setNewFeature('');
        }
    };

    const removeFeature = (index: number): void => {
        // Disable removing features while loading
        if (loading) return;
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    };

    const handleInputChange = (field: keyof ISubscriptionFormData, value: string | boolean): void => {
        if (loading) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAccessLevelChange = (field: keyof IAccessLevel, value: string | boolean): void => {
        if (loading) return;
        setFormData(prev => ({ ...prev, accessLevel: { ...prev.accessLevel, [field]: value } }));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature();
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                        </h2>
                        <button onClick={handleClose} disabled={loading} className="text-slate-400 hover:text-slate-600 p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Plan Name *
                                </label>
                                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter plan name" disabled={loading}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Price ($) *
                                </label>
                                <input type="number" min="0" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="0.00" disabled={loading}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Duration (days) *
                            </label>
                            <input type="number" min="1" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="30" disabled={loading}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Access Level */}
                        <div className="bg-slate-50 rounded-lg p-4">
                            <h3 className="font-semibold text-slate-700 mb-4">Access Level</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Expert Calls Per Month
                                    </label>
                                    <input type="number" min="0" value={formData.accessLevel.expertCallsPerMonth || 0} onChange={(e) => handleAccessLevelChange('expertCallsPerMonth', e.target.value)} disabled={loading}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.accessLevel.videoAccess || false} onChange={(e) => handleAccessLevelChange('videoAccess', e.target.checked)} disabled={loading}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className={`text-sm font-medium text-slate-700 ${loading ? 'opacity-50' : ''}`}>
                                            Video Access
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.accessLevel.chatSupport || false} onChange={(e) => handleAccessLevelChange('chatSupport', e.target.checked)} disabled={loading}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className={`text-sm font-medium text-slate-700 ${loading ? 'opacity-50' : ''}`}>
                                            Chat Support
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Features
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a feature..." disabled={loading}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                                <button onClick={addFeature} disabled={loading || !newFeature.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                                        <span className="text-sm">{feature}</span>
                                        <button onClick={() => removeFeature(index)} disabled={loading} className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} disabled={loading}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className={`text-sm font-medium text-slate-700 ${loading ? 'opacity-50' : ''}`}>
                                    Active Plan
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4 border-t">
                            <button onClick={handleClose} disabled={loading}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        {editingPlan ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        {editingPlan ? 'Update Plan' : 'Create Plan'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlanModal;