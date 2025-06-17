"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { ISubscriptionFormData, ISubscriptionPlan } from '@/types/subscriptionTypes';
import SubscriptionPlanModal from '@/components/admin/SubscriptionPlanModal';
import { fetchPlans, createPlan, updatePlan, deletePlan, planStatus } from '@/app/service/admin/subscriptionApi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const SubscriptionManagement: React.FC = () => {
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingPlan, setEditingPlan] = useState<ISubscriptionPlan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Fetch plans on component mount
    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetchPlans();
            console.log("response in load", response)
            if (response?.status && response?.planData) {
                setPlans(response.planData);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: ISubscriptionPlan): void => {
        setEditingPlan(plan);
        setShowModal(true);
    };

    const handleAddNew = (): void => {
        setEditingPlan(null);
        setShowModal(true);
    };

    const handleModalSubmit = async (formData: ISubscriptionFormData): Promise<void> => {
        try {
            setActionLoading('submit');
            if (editingPlan) {
                // Update existing plan
                const response = await updatePlan(editingPlan._id, formData);
                if (response?.status) {
                    toast.success("Update plan Successfully")
                    await loadPlans();
                }
            } else {
                const response = await createPlan(formData);
                if (response?.status) {
                    toast.success("Create plan Successfully")
                    await loadPlans();
                }
            }
            setShowModal(false);
            setEditingPlan(null);
        } catch (error) {
            toast.error("Error saving plan:")
            console.error('Error saving plan:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleModalClose = (): void => {
        setShowModal(false);
        setEditingPlan(null);
    };

    const handleDelete = async (planId: string): Promise<void> => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                setActionLoading(planId);
                const response = await deletePlan(planId);
                if (response.status) {
                    toast.success('Plan deleted successfully');
                    await loadPlans();
                }
            } catch (error) {
                console.log("Error deleting plan:", error)
                toast.error('Failed to delete plan');
            } finally {
                setActionLoading(null);
            }
        }
    };

    const toggleStatus = async (planId: string): Promise<void> => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to change plan status!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change it!',
        });
        if (result.isConfirmed) {
            try {
                setActionLoading(`status-${planId}`);
                const response = await planStatus(planId);
                if (response?.status) {
                    toast.success('Plan Toogle successfully');
                    await loadPlans();
                }
            } catch (error) {
                console.log("Error toggling plan status:", error)
                toast.error('Failed toggling plan status');
            } finally {
                setActionLoading(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-slate-600">Loading subscription plans...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Subscription Management
                            </h1>
                            <p className="text-slate-600">
                                Manage your subscription plans and pricing tiers
                            </p>
                        </div>
                        <button onClick={handleAddNew} disabled={actionLoading === 'submit'}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionLoading === 'submit' ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Plus size={20} />
                            )}
                            Add New Plan
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                    <div className="bg-[#151231] rounded-xl p-6 shadow-lg border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-200 text-sm font-medium">Total Plans</p>
                                <p className="text-3xl font-bold text-slate-100">{plans.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#151231] rounded-xl p-6 shadow-lg border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-200 text-sm font-medium">Active Plans</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {plans.filter(p => p.isActive).length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Check size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#151231] rounded-xl p-6 shadow-lg border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-200 text-sm font-medium">Avg. Price</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    ${plans.length > 0 ? (plans.reduce((sum, p) => sum + p.price, 0) / plans.length).toFixed(2) : '0.00'}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                {plans.length === 0 ? (
                    <div className=" text-center mt-8">
                        <div className="text-slate-400 mb-4">
                            <Plus size={48} className="mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-600 mb-2">No subscription plans found</h3>
                        <p className="text-slate-500 mb-6">Get started by creating your first subscription plan.</p>
                        <button onClick={handleAddNew}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                        >
                            <Plus size={20} />
                            Create First Plan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        {plans.map((plan) => (
                            <div key={plan._id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-1">{plan.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-slate-800">${plan.price}</span>
                                                <span className="text-slate-500">/{plan.duration} days</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleStatus(plan._id)} disabled={actionLoading === `status-${plan._id}`}
                                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.isActive
                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    }`}
                                            >
                                                {actionLoading === `status-${plan._id}` ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    plan.isActive ? <Eye size={16} /> : <EyeOff size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Access Level */}
                                    {plan.accessLevel && (
                                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-slate-700 mb-2">Access Level</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Expert Calls</span>
                                                    <span className="font-medium">{plan.accessLevel.expertCallsPerMonth || 0}/month</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Video Access</span>
                                                    <span className={`font-medium ${plan.accessLevel.videoAccess ? 'text-green-600' : 'text-red-600'}`}>
                                                        {plan.accessLevel.videoAccess ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Chat Support</span>
                                                    <span className={`font-medium ${plan.accessLevel.chatSupport ? 'text-green-600' : 'text-red-600'}`}>
                                                        {plan.accessLevel.chatSupport ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-slate-700 mb-2">Features</h4>
                                        <div className="space-y-1">
                                            {plan.features.slice(0, 3).map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Check size={14} className="text-green-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {plan.features.length > 3 && (
                                                <div className="text-xs text-slate-500">
                                                    +{plan.features.length - 3} more features
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(plan)} disabled={actionLoading !== null}
                                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(plan._id)} disabled={actionLoading !== null}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === plan._id ? (
                                                <Loader2 className="animate-spin" size={14} />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <SubscriptionPlanModal isOpen={showModal} onClose={handleModalClose} onSubmit={handleModalSubmit} editingPlan={editingPlan} loading={actionLoading === 'submit'} />
            </div>
        </div>
    );
};

export default SubscriptionManagement;