"use client"

import { useEffect, useState } from "react";
import { Award, Shield, Star, Users } from "lucide-react";

import userApi from "@/app/service/user/userApi";
import { ISubscriptionPlan } from "@/types/subscriptionTypes";
import orderApi from "@/app/service/user/orderApi";
import Swal from "sweetalert2";

import { useAuthStore } from "@/store/authStore";
import { IUserSubscription } from "@/types/types";

export const SubscriptionPlans = () => {
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [currentUserPlan, setCurrentUserPlan] = useState<IUserSubscription>();
    const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

    const { user } = useAuthStore();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await userApi.SubscriptionData();
                if (response.status) {
                    const activePlans = response.planData?.filter((plan: ISubscriptionPlan) => plan.isActive);
                    setPlans(activePlans || []);
                }
            } catch (error) {
                console.error("error while fetching plan", error)
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentPlan = async () => {
            if (!user) return;
            try {
                const response = await userApi.checkSubscription();
                if (response.status && response.subscription) {
                    setCurrentUserPlan(response.subscription);
                }
            } catch (error) {
                console.error("error while fetching current plan", error);
            }
        };

        fetchPlans();
        fetchCurrentPlan();
    }, [user]);

    const handlePurchase = async (planId: string) => {
        const selectedPlan = plans.find(plan => plan._id === planId);
        if (!selectedPlan) return;

        // If user wants to upgrade
        if (currentUserPlan) {
            const currentPlan = plans.find(plan => plan._id === currentUserPlan.subscriptionPlan._id);
            const callsRemaining = currentUserPlan.callsRemaining || 0;
            const newCalls = selectedPlan.accessLevel?.expertCallsPerMonth || 0;

            const result = await Swal.fire({
                title: `Upgrade to ${selectedPlan.name}?`,
                html: `
                    You currently have <b>${currentPlan?.name || "Existing"}</b> plan with <b>${callsRemaining}</b> call${callsRemaining !== 1 ? 's' : ''} remaining.<br><br>
                    Purchasing <b>${selectedPlan.name}</b> plan will:<br>
                    - Add <b>${newCalls}</b> new expert calls to your account<br>
                    - Your remaining <b>${callsRemaining}</b> call${callsRemaining !== 1 ? 's' : ''} will be carried forward<br>
                    - Total calls after purchase: <b>${callsRemaining + newCalls}</b>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Continue',
                cancelButtonText: 'Cancel',
                background: '#1F2937',
                color: '#fff',
                customClass: {
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white',
                }
            });

            if (!result.isConfirmed) return;
        }

        setPurchaseLoading(planId);
        try {
            await orderApi.SubscriptionPurchase(planId);
        } catch (error) {
            console.error('Purchase error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Purchase Failed',
                text: 'Please try again later.',
                background: '#1F2937',
                color: '#fff',
            });
        } finally {
            setPurchaseLoading(null);
        }
    };

    if (loading) {
        return <div className="text-center text-white py-10">Loading subscription plans...</div>;
    }

    return (
        <div className="container mx-auto px-6 mt-8">
            <div className="text-center mb-16">
                <div className="inline-flex items-center bg-purple-100 rounded-full px-4 py-2 mb-6">
                    <Award className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm text-purple-600 font-medium">Choose Your Path</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    Subscription Plans
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Select the perfect plan to accelerate your trading journey.
                </p>

                <div className="inline-flex bg-gray-100 rounded-full p-1">
                    <button onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full transition-all ${billingCycle === 'monthly'
                            ? 'bg-[#151231] text-gray-100 shadow-sm'
                            : 'text-gray-800'
                            }`}>Monthly</button>
                    <button onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full transition-all relative ${billingCycle === 'yearly'
                            ? 'bg-[#151231] text-gray-100 shadow-sm'
                            : 'text-gray-800'
                            }`}>Yearly
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Save 17%</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                    <div key={index} className="relative bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-gray-100 hover:border-gray-200">
                        <div className="text-center mb-8">
                            <div className="inline-flex bg-gradient-to-r w-16 h-16 rounded-2xl items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">
                                    ₹{billingCycle === 'monthly' ? plan.price : Math.floor(plan.price / 12)}
                                </span>
                                <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                                {billingCycle === 'yearly' && (
                                    <div className="text-sm text-green-600 font-medium mt-1">
                                        Billed ₹{plan.price} annually
                                    </div>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <div className="bg-green-100 rounded-full p-1 mr-3">
                                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => handlePurchase(plan._id)} disabled={purchaseLoading === plan._id}
                            className="w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-cyan-500 to-purple-500 text-black hover:shadow-xl hover:shadow-purple-500/25"
                        >
                            {purchaseLoading === plan._id ? 'Processing...' : 'Get Started'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-5 text-center">
                <div className="flex items-center justify-center space-x-8 opacity-60 text-white">
                    <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        <span className="text-sm">Bank-level Security</span>
                    </div>
                    <div className="flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        <span className="text-sm">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        <span className="text-sm">15,000+ Members</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
