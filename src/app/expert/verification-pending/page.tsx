"use client"

import { Clock, CheckCircle, Mail, Phone, ArrowRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VerificationPending = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen  flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="bg-[#151231] rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Status Icon */}
                    <div className="mb-8">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Clock className="w-12 h-12 text-orange-500" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-[#fefeeb] mb-4">
                            Verification in Progress
                        </h1>
                        <p className="text-xl text-gray-300 mb-6">
                            Thank you for submitting your expert application!
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We&apos;ve received your application and supporting documents. Our team is currently
                            reviewing your credentials and will get back to you within 2-3 business days.
                        </p>
                    </div>

                    {/* Status Timeline */}
                    <div className="flex justify-evenly items-stretch w-[90%] gap-4 mx-auto">
                        {/* Application Status */}
                        <div className="bg-blue-900/30 border-blue-700/50 w-1/2 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-[#fefeeb] flex items-center justify-center mb-3 ">Application Status</h3>
                            <div className='border-t border-gray-700 mb-4'></div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-300">Application submitted successfully</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                    <span className="text-gray-300">Documents under review</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex-shrink-0"></div>
                                    <span className="text-gray-500">Identity verification</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex-shrink-0"></div>
                                    <span className="text-gray-500">Final approval</span>
                                </div>
                            </div>
                        </div>

                        {/* What happens next? */}
                        <div className="bg-blue-900/30 border border-blue-700/50 w-1/2 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-[#fefeeb] mb-3 flex items-center justify-center gap-2">
                                <Mail className="w-5 h-5" />
                                What happens next?
                            </h3>
                            <div className='border-t border-gray-700 mb-4'></div>
                            <div className="space-y-3 text-gray-300">
                                <p className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>We&apos;ll review your trading experience and credentials</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>Our team may contact you for additional information if needed</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>You&apos;ll receive an email notification once verification is complete</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>If approved, you can start accepting clients immediately</span>
                                </p>
                            </div>
                        </div>
                    </div>



                    {/* Contact Info */}
                    <div className="bg-gray-800/30 rounded-xl w-[90%] mx-auto p-4 mb-8">
                        <p className="text-sm text-gray-400 mb-2">
                            Questions about your application?
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm">
                            <a href="mailto:support@example.com" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                                <Mail className="w-4 h-4" />
                                support@tradeclub.com
                            </a>
                            <a href="tel:+1234567890" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                                <Phone className="w-4 h-4" />
                                +91 987 654 3210
                            </a>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => router.replace('/')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
                        <Home className="w-5 h-5" />
                        Go to Home
                    </button>
                    <button
                        onClick={() => router.replace('/expert/login')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Application Reference */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-500">
                        Application Reference: <span className="text-gray-400 font-mono">EXP-98765</span>
                    </p>
                </div>
            </div>
        </div>
        </div >
    );
};

export default VerificationPending;