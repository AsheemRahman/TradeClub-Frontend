import React from 'react';
import { X, Shield, Lock, Eye, Users, FileText, Mail, Phone, MapPin } from "lucide-react";


interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Privacy Policy</h2>
                                <p className="text-blue-100 mt-1">Your privacy is our priority</p>
                            </div>
                        </div>
                        <button onClick={onClose}  className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-8 text-gray-700 space-y-8">
                        {/* Introduction */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-lg leading-relaxed text-gray-800">
                                At <span className="font-semibold text-blue-600">TradeClub</span>, we are committed to protecting your privacy and ensuring the security of your personal information.
                                This Privacy Policy explains how we collect, use, and safeguard your data.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <section className="group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Information We Collect</h3>
                            </div>
                            <p className="mb-4 text-lg">We collect information you provide directly to us, such as:</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    "Account registration information (name, email, phone number)",
                                    "Payment and billing information",
                                    "Trading preferences and settings",
                                    "Communication records (chat messages, support tickets)",
                                    "Usage data and analytics"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section className="group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                    <Eye className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">How We Use Your Information</h3>
                            </div>
                            <p className="mb-4 text-lg">We use your information to:</p>
                            <div className="space-y-3">
                                {[
                                    "Provide and maintain our trading platform services",
                                    "Process payments and manage subscriptions",
                                    "Send trade alerts and market insights",
                                    "Facilitate communication between users and experts",
                                    "Improve our services and user experience",
                                    "Comply with legal obligations"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                    <Users className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Information Sharing</h3>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-4">
                                <p className="text-lg font-medium text-orange-800">
                                    We do not sell, trade, or rent your personal information to third parties.
                                </p>
                            </div>
                            <p className="mb-4 text-lg">We may share your information only in the following circumstances:</p>
                            <div className="space-y-3">
                                {[
                                    "With your explicit consent",
                                    "To comply with legal obligations",
                                    "With service providers who assist in our operations",
                                    "To protect our rights and prevent fraud"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="group">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                    <Lock className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Data Security</h3>
                            </div>
                            <p className="mb-4 text-lg">
                                We implement appropriate technical and organizational measures to protect your personal information against
                                unauthorized access, alteration, disclosure, or destruction. This includes:
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    "Encryption of sensitive data",
                                    "Secure server infrastructure",
                                    "Regular security audits and updates",
                                    "Access controls and authentication measures"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
                                        <Lock className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h3>
                            <p className="text-lg text-gray-700">
                                We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
                                You may request deletion of your account and associated data at any time.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="group">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h3>
                            <p className="mb-4 text-lg">You have the right to:</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {[
                                    "Access and update your personal information",
                                    "Request deletion of your data",
                                    "Opt-out of marketing communications",
                                    "Data portability",
                                    "File complaints with regulatory authorities"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h3>
                            <p className="text-lg text-gray-700">
                                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide
                                personalized content. You can manage cookie preferences through your browser settings.
                            </p>
                        </section>

                        {/* Contact Section */}
                        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8">
                            <h3 className="text-2xl font-bold mb-4 flex items-center">
                                <Mail className="w-6 h-6 mr-3" />
                                Contact Us
                            </h3>
                            <p className="mb-6 text-gray-300 text-lg">
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                    <span className="text-gray-200">tradeclub03@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <Phone className="w-5 h-5 text-green-400" />
                                    <span className="text-gray-200">+97 (859) 075-4230</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <MapPin className="w-5 h-5 text-red-400" />
                                    <span className="text-gray-200">123 Kerala, India, IND 60000</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;