import { X, Shield, AlertTriangle, Users, CreditCard, Scale, Mail } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Terms & Conditions</h2>
                            <p className="text-blue-100 text-sm">Please read these terms carefully before using TradeClub</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Welcome to <span className="font-semibold text-blue-600">TradeClub</span>. These Terms and Conditions govern your use of our trading platform and services.
                            </p>
                        </div>

                        {/* Terms Sections */}
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                        <Shield className="text-green-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Acceptance of Terms</h3>
                                </div>
                                <div className="pl-11">
                                    <p className="text-gray-600 leading-relaxed">
                                        By accessing and using TradeClub, you accept and agree to be bound by the terms and provision of this agreement.
                                        If you do not agree to abide by the above, please do not use this service.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <Users className="text-blue-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Trading Services</h3>
                                </div>
                                <div className="pl-11 space-y-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        TradeClub provides a platform for trading education, real-time trade alerts, and expert consultation services.
                                        All trading involves risk, and past performance does not guarantee future results.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            "Real-time trade alerts and market insights",
                                            "Educational content and trading strategies",
                                            "Expert consultation and mentorship",
                                            "Community chat and video call features"
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                        <Scale className="text-purple-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">User Responsibilities</h3>
                                </div>
                                <div className="pl-11">
                                    <p className="text-gray-600 mb-3">Users are responsible for:</p>
                                    <div className="space-y-2">
                                        {[
                                            "Maintaining the confidentiality of their account information",
                                            "Making informed trading decisions based on their own research",
                                            "Understanding the risks associated with trading",
                                            "Complying with all applicable laws and regulations"
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-3 p-2">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                        <CreditCard className="text-orange-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Subscription Services</h3>
                                </div>
                                <div className="pl-11">
                                    <p className="text-gray-600 leading-relaxed">
                                        Our subscription services provide access to premium features including expert alerts, advanced learning modules,
                                        and direct communication with trading experts. <span className="font-medium text-orange-600">Subscription fees are non-refundable</span> unless otherwise stated.
                                    </p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                        <AlertTriangle className="text-red-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Risk Disclosure</h3>
                                </div>
                                <div className="pl-11">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 leading-relaxed font-medium">
                                            Trading in financial markets involves substantial risk of loss and is not suitable for all investors.
                                            The high degree of leverage can work against you as well as for you. You should carefully consider
                                            whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                        <Shield className="text-gray-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Limitation of Liability</h3>
                                </div>
                                <div className="pl-11">
                                    <p className="text-gray-600 leading-relaxed">
                                        TradeClub shall not be liable for any direct, indirect, incidental, or consequential damages arising
                                        from the use of our platform or services. <span className="font-medium">We do not guarantee profits or prevent losses.</span>
                                    </p>
                                </div>
                            </section>

                            {/* Section 7 */}
                            <section className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                                        <Mail className="text-cyan-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                                </div>
                                <div className="pl-11">
                                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                        <p className="text-cyan-800">
                                            For questions about these Terms & Conditions, please contact us at{' '}
                                            <a href="mailto:legal@tradeclub.com" className="font-semibold underline hover:text-cyan-600 transition-colors">
                                                legal@tradeclub.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t p-6 flex-shrink-0">
                    <div className="flex justify-center">
                        <button onClick={onClose}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            I Understand & Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};