"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/service/shared/sharedApi";


interface ResetPasswordProps {
    role: 'user' | 'expert';
}

const ResetPasswordPage: React.FC<ResetPasswordProps> = ({ role }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Invalid password reset link. Email not found.");
            router.replace(role == 'user' ? '/forgetPassword' : '/expert/forgetPassword');
            return;
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            setError("Passwords do not match!");
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
        <div className="flex my-10 items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-[#151231] p-8 rounded-2xl shadow-2xl w-[60%] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#E54B00]">Create New Password</h2>
                <h3 className="text-2xl font-bold mb-6 text-center text-[#E54B00]" >Next Time ! Don’t Forget your password.</h3>

                <div className="mb-4 w-[70%]">
                    <label className="block opacity-80 text-[#E54B00] text-sm mb-2">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>

                <div className="mb-6 w-[70%]  ">
                    <label className="block opacity-80 text-[#E54B00] text-sm mb-2">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                </div>

                {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

                <button type="submit" className="w-[70%] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-200" disabled={loading}>
                    {loading ? "Resetting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
