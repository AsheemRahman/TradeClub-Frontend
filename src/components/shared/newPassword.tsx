"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/service/shared/sharedApi";
import { useAuthStore } from "@/store/authStore";


interface ResetPasswordProps {
    role: 'user' | 'expert';
}

const ResetPasswordPage: React.FC<ResetPasswordProps> = ({ role = 'user' }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const authStore = useAuthStore();

    useEffect(() => {
        const alreadyLoggedIn = authStore.user !== null;
        if (alreadyLoggedIn) {
            router.replace(role == "user" ? '/home' : '/expert/dashboard');
        }
    }, [authStore.user, role, router])

    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handlePasswordChange = (password: string) => {
        setNewPassword(password);
        setPasswordStrength(checkPasswordStrength(password));
    };

    const getStrengthColor = (strength: number) => {
        if (strength <= 2) return "bg-red-500";
        if (strength <= 3) return "bg-yellow-500";
        if (strength <= 4) return "bg-blue-500";
        return "bg-green-500";
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 2) return "Weak";
        if (strength <= 3) return "Fair";
        if (strength <= 4) return "Good";
        return "Strong";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Invalid password reset link. Email not found.");
            router.replace(role === 'user' ? '/forgetPassword' : '/expert/forgetPassword');
            return;
        }
        if (newPassword.trim() !== confirmPassword.trim()) {
            setError("Passwords do not match!");
            return;
        }
        if (passwordStrength < 3) {
            setError("Password is too weak. Please choose a stronger password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await resetPassword(email, newPassword.trim(), role);
            if (!response.status) {
                setError(response?.message || "Failed to reset password. Please try again.");
            } else {
                router.replace(role === 'user' ? '/login' : '/expert/login');
            }
        } catch (err) {
            setError("Server error. Please try again.");
            console.error("Password reset error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center p-4">
            <div className="relative w-[70%]">
                <div className="bg-[#151231] backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Reset Password
                        </h1>
                        <p className="text-gray-300 text-sm">
                            Create a strong new password for your account
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                New Password
                            </label>
                            <div className="relative">
                                <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => handlePasswordChange(e.target.value)} placeholder="Enter your new password" required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {newPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-300">Password Strength</span>
                                        <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-400' : passwordStrength >= 3 ? 'text-blue-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {getStrengthText(passwordStrength)}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div key={level} className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-600'}`} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your new password" required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors" >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {confirmPassword && (
                                <div className="flex items-center space-x-2 text-xs">
                                    {newPassword === confirmPassword ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                            <span className="text-red-400">Passwords don&apos;t match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button type="submit" onClick={handleSubmit} disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Updating Password...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>Update Password</span>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Security Note */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-300">
                                <p className="font-medium mb-1">Security Tips:</p>
                                <ul className="space-y-1 text-xs text-blue-200">
                                    <li>• Use at least 8 characters</li>
                                    <li>• Include uppercase and lowercase letters</li>
                                    <li>• Add numbers and special characters</li>
                                    <li>• Avoid common words or personal information</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        Remember your password this time! 😉
                    </p>
                </div>
            </div>
        </div >
    );
};

export default ResetPasswordPage;