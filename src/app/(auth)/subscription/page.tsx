"use client"

import { useEffect, useState } from 'react';
import { ISubscriptionPlan } from '@/types/subscriptionTypes';
import userApi from '@/app/service/user/userApi';
import orderApi from '@/app/service/user/orderApi';



const SubscriptionPlansPage = () => {
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

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
        fetchPlans();
    }, []);

    // Function to handle purchase
    const handlePurchase = async (planId: string) => {
        setPurchaseLoading(planId);
        try {
            await orderApi.SubscriptionPurchase(planId)
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed. Please try again.');
        } finally {
            setPurchaseLoading(null);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDuration = (duration: number) => {
        if (duration === 30) return 'Monthly';
        if (duration === 365) return 'Yearly';
        if (duration < 30) return `${duration} Months`;
        return `${Math.floor(duration / 12)} Year${Math.floor(duration / 12) > 1 ? 's' : ''}`;
    };

    const getMonthlyPrice = (price: number, duration: number) => {
        return price / duration;
    };

    const getMostPopularPlan = () => {
        // Logic to determine most popular plan (could be based on duration, price, etc.)
        return plans.find(plan => plan.duration === 12) || plans[1] || null;
    };

    const mostPopular = getMostPopularPlan();

    return (
        <div className="min-h-screen rounded-lg shadow-2xl mx-5">
            {/* Hero Section */}
            <div className="pt-8 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
                        Unlock premium features and take your experience to the next level with our flexible subscription plans.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {loading && plans.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading subscription plans...</p>
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No subscription plans available at the moment</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
                            {plans.map((plan) => {
                                const isPopular = mostPopular?._id === plan._id;
                                const monthlyPrice = getMonthlyPrice(plan.price, plan.duration);

                                return (
                                    <div
                                        key={plan._id}
                                        className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isPopular
                                            ? 'border-purple-500 ring-4 ring-purple-100 scale-105'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        {/* Popular Badge */}
                                        {isPopular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-8">
                                            {/* Plan Header */}
                                            <div className="text-center mb-8">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {plan.name}
                                                </h3>
                                                <div className="mb-4">
                                                    <span className="text-5xl font-bold text-gray-900">
                                                        {formatPrice(plan.price)}
                                                    </span>
                                                    <div className="text-gray-500 mt-1">
                                                        <span className="text-lg">
                                                            {formatDuration(plan.duration)}
                                                        </span>
                                                        {plan.duration > 365 && (
                                                            <div className="text-sm">
                                                                ({formatPrice(monthlyPrice)}/month)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Access Level Highlights */}
                                            {plan.accessLevel && (
                                                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                                                    <h4 className="font-semibold text-gray-900 mb-3 text-center">
                                                        What&apos;s Included
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {plan.accessLevel.expertCallsPerMonth !== undefined && (
                                                            <div className="flex items-center justify-center text-sm">
                                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                                </svg>
                                                                <span className="font-medium">
                                                                    {plan.accessLevel.expertCallsPerMonth === 0 ? 'No expert calls' : `${plan.accessLevel.expertCallsPerMonth} expert calls/month`}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {plan.accessLevel.videoAccess !== undefined && (
                                                            <div className="flex items-center justify-center text-sm">
                                                                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                                </svg>
                                                                <span className="font-medium">
                                                                    {plan.accessLevel.videoAccess ? 'Video Access' : 'No Video Access'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {plan.accessLevel.chatSupport !== undefined && (
                                                            <div className="flex items-center justify-center text-sm">
                                                                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="font-medium">
                                                                    {plan.accessLevel.chatSupport ? 'Priority Support' : 'Basic Support'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Features List */}
                                            {plan.features.length > 0 && (
                                                <div className="mb-8">
                                                    <h4 className="font-semibold text-gray-900 mb-4">
                                                        Features
                                                    </h4>
                                                    <ul className="space-y-3">
                                                        {plan.features.map((feature, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start text-gray-700"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Purchase Button */}
                                            <button onClick={() => handlePurchase(plan._id)} disabled={purchaseLoading === plan._id}
                                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${isPopular
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
                                                    }`}
                                            >
                                                {purchaseLoading === plan._id ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    `Get Started with ${plan.name}`
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* FAQ or Additional Info Section */}
            <div className="bg-gray-50 rounded-lg py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Can I change my plan later?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                            </p>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee, so you can try any plan risk-free.
                            </p>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                How do I cancel?
                            </h3>
                            <p className="text-gray-600">
                                You can cancel your subscription at any time from your account settings. No questions asked.
                            </p>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and other popular payment methods.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SubscriptionPlansPage;