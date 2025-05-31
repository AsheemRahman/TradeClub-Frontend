import React from 'react';
import { Shield, Check } from 'lucide-react';

interface OtpState {
    showOtpModal: boolean;
    otpCode: string;
    otpType: string;
    isVerifying: boolean;
    otpSent: boolean;
    countdown: number;
}

interface EditForm {
    phoneNumber: string;
}

interface Props {
    otpState: OtpState;
    setOtpState: React.Dispatch<React.SetStateAction<OtpState>>;
    verifyOtp: () => void;
    sendOtp: (type: 'email' | 'phone') => void;
    editForm: EditForm;
}

const OtpVerificationModal: React.FC<Props> = ({ otpState, setOtpState, verifyOtp, sendOtp, editForm }) => {
    if (!otpState.showOtpModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Verify Your Identity</h3>
                    <p className="text-slate-400">
                        {otpState.otpType === 'phone'
                            ? `We've sent a verification code to ${editForm.phoneNumber}`
                            : "We've sent a verification code to your registered email"}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* OTP Input */}
                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium">Verification Code</label>
                        <input
                            type="text"
                            value={otpState.otpCode}
                            onChange={(e) =>
                                setOtpState((prev) => ({ ...prev, otpCode: e.target.value }))
                            }
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-purple-500 transition-colors"
                            disabled={otpState.isVerifying}
                        />
                        <p className="text-slate-500 text-sm text-center">
                            Code expires in 10 minutes
                        </p>
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                        {otpState.countdown > 0 ? (
                            <p className="text-slate-400 text-sm">
                                Resend code in {otpState.countdown}s
                            </p>
                        ) : (
                            <button
                                onClick={() => {
                                    if (otpState.otpType === 'email' || otpState.otpType === 'phone') {
                                        sendOtp(otpState.otpType);
                                    }
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                disabled={otpState.isVerifying}
                            >
                                Resend verification code
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={verifyOtp}
                            disabled={otpState.otpCode.length !== 6 || otpState.isVerifying}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {otpState.isVerifying ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Verify
                                </>
                            )}
                        </button>
                        <button
                            onClick={() =>
                                setOtpState({
                                    showOtpModal: false,
                                    otpCode: '',
                                    otpType: 'email',
                                    isVerifying: false,
                                    otpSent: false,
                                    countdown: 0,
                                })
                            }
                            disabled={otpState.isVerifying}
                            className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                        <p className="text-slate-400 text-sm text-center">
                            <strong>For demo purposes:</strong> Use code{' '}
                            <span className="font-mono bg-slate-600 px-2 py-1 rounded text-white">
                                123456
                            </span>{' '}
                            to verify
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationModal;
