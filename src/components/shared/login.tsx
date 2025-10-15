'use client';

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageSlider from "./ImageSlider";
import { IGoogleLogin } from "@/types/types";

interface LoginPageProps {
    role: "user" | "expert";
    onSubmit: (formData: { email: string; password: string; role: "user" | "expert" }) => void;
    onGoogleSignup: (userData: IGoogleLogin, role: "user" | "expert") => void;
}

const Login: React.FC<LoginPageProps> = ({ role, onSubmit, onGoogleSignup }) => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { data: session, status } = useSession();
    const [hasCalledGoogleSignup, setHasCalledGoogleSignup] = useState(false);

    const isUser = role === "user";

    // Google sign-in (NextAuth only)
    const handleGoogleLogin = async () => {
        try {
            const result = await signIn("google", { redirect: false });
            if (result?.error) {
                toast.error("Sign in with Google failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during Google Sign-in.");
        }
    };

    // When Google session becomes available, notify parent to handle backend
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setHasCalledGoogleSignup(true);
            const userData = {
                fullName: session.user.name ?? "",
                email: session.user.email ?? "",
                profilePicture: session.user.image ?? "",
                role,
            };
            onGoogleSignup(userData, role);
        }
    }, [session, status, onGoogleSignup, role, hasCalledGoogleSignup]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit({ ...formData, role });
        setIsLoading(false);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col items-center md:flex-row bg-[#151231] text-[#fefeeb] rounded-[10px] mx-5 overflow-hidden shadow-lg w-full h-[550px]">
                {/* Image Section */}
                <ImageSlider />
                {/* Form Section */}
                <div className="w-full px-6 md:px-20 py-6">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <h1 className="text-4xl font-semibold mb-4">
                            {isUser ? "Unlock Your Trading Potential" : "Expert Login Dashboard"}
                        </h1>

                        <input type="text" name="email" placeholder={isUser ? "Email or Phone Number" : "Expert Email"} required value={formData.email} disabled={isLoading}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-transparent border-b border-white py-3 text-white placeholder-gray-300 focus:outline-none"
                        />

                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required value={formData.password} disabled={isLoading}
                                className="bg-transparent border-b border-white py-3 w-full text-white placeholder-gray-300 focus:outline-none"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-xl">
                                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`} />
                            </span>
                        </div>

                        <div className="text-right text-sm">
                            <Link href={isUser ? "/forgotPassword" : "/expert/forgotPassword"} className="text-[#db4437] hover:text-[#f55]">
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="bg-[#db4437] hover:bg-[#f55] text-white py-2 rounded-lg transition-all disabled:opacity-60" disabled={isLoading}>
                            {isLoading ? "Logging in..." : isUser ? "Log In" : "Login as Expert"}
                        </button>
                    </form>

                    {!isUser && (
                        <p className="mt-6 text-sm text-gray-400 text-center">
                            Note: Expert access is limited to authorized personnel only.
                        </p>
                    )}

                    {/* Social Logins */}
                    <div className="relative my-6 text-center">
                        <span className="bg-[#1A1A1A] px-4 relative z-10">Or Continue With</span>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-[#fefeeb] z-0"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <button className="bg-[#0866FF] hover:bg-[#4285F4] text-white py-2 w-full rounded-md flex items-center justify-center gap-2">
                            <i className="bi bi-facebook"></i> Facebook
                        </button>
                        <button onClick={handleGoogleLogin} className="bg-[#db4437] hover:bg-[#f55] text-white py-2 w-full rounded-md flex items-center justify-center gap-2">
                            <i className="bi bi-google"></i> Google
                        </button>
                    </div>

                    <div className="text-center text-sm mt-7">
                        Don&apos;t have an account?
                        <Link href={isUser ? "/register" : "/expert/register"} className="text-[#db4437] hover:text-[#f55] ml-3 underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
