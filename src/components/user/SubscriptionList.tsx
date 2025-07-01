"use client"

import { useEffect, useState } from "react";
import { Award, Shield, Star, Users } from "lucide-react";

import { SubscriptionData } from "@/app/service/user/userApi";
import { ISubscriptionPlan } from "@/types/subscriptionTypes";


export const SubscriptionPlans = () => {
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await SubscriptionData();
                if(response.status){
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
                    All plans include our core features with varying levels of support and advanced tools.
                </p>

                {/* Billing toggle */}
                <div className="inline-flex bg-gray-100 rounded-full p-1">
                    <button onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full transition-all ${billingCycle === 'monthly'
                            ? 'bg-[#151231] text-gray-100 shadow-sm'
                            : 'text-gray-800'
                            }`}
                    >
                        Monthly
                    </button>
                    <button onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full transition-all relative ${billingCycle === 'yearly'
                            ? 'bg-[#151231] text-gray-100 shadow-sm'
                            : 'text-gray-800'
                            }`}
                    >
                        Yearly
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Save 17%
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                    <div key={index}
                        className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
                            ${plan.popular ? 'border-purple-200 shadow-purple-100' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        {/* {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            </div>
                        )} */}

                        <div className="text-center mb-8">
                            <div className={`inline-flex bg-gradient-to-r ${plan.gradient} w-16 h-16 rounded-2xl items-center justify-center mb-4`}>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            {/* <p className="text-gray-600 mb-6">{plan.description}</p> */}

                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">
                                    ${billingCycle === 'monthly' ? plan.price : Math.floor(plan.price / 12)}
                                </span>
                                <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                                {billingCycle === 'yearly' && (
                                    <div className="text-sm text-green-600 font-medium mt-1">
                                        Billed ${plan.price} annually
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

                        <button className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 
                            ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-500/25'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}>
                            Get Started
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
