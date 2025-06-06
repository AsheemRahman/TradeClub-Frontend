'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

import ImageSlider from './ImageSlider';
import { loginType } from '@/types/types';
import { LoginPost } from '@/app/service/shared/sharedApi';

import { useAuthStore } from '@/store/authStore';

interface LoginPage {
    role: 'user' | 'expert';
}

const Login: React.FC<LoginPage> = ({ role }) => {
    const [formData, setFormData] = useState<loginType>({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const isUser = role === 'user';
    const authStore = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = { ...formData, role };
            const response = await LoginPost(payload);
            if (response.success) {
                const { user, accessToken } = response.data;
                authStore.setUserAuth(user, accessToken);
                toast.success(response.message);
                router.replace(isUser ? '/home' : '/expert/dashboard');
            } else {
                toast.error(response?.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error("Login error:", error);
            // toast.error("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col items-center md:flex-row bg-[#151231] text-[#fefeeb] rounded-[10px] mx-5 overflow-hidden shadow-lg w-full h-[550px]">

                {/* Image Section */}
                <ImageSlider />

                {/* Form Section */}
                <div className="w-full px-6 md:px-20 py-6">
                    <form method="post" className="flex flex-col gap-4" onSubmit={handleLogin}>
                        <h1 className="text-4xl font-semibold mb-4">
                            {isUser ? 'Unlock Your Trading Potential' : 'Expert Login Dashboard'}
                        </h1>

                        <input type="text" name="email" placeholder={isUser ? 'Email or Phone Number' : 'Expert Email'} required value={formData.email} disabled={isLoading}
                            className="bg-transparent border-b border-white py-3 text-white placeholder-gray-300 focus:outline-none"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" required value={formData.password} disabled={isLoading}
                                className="bg-transparent border-b border-white py-3 w-full text-white placeholder-gray-300 focus:outline-none"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-xl">
                                <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                            </span>
                        </div>

                        <div className="text-right text-sm">
                            <Link href={role === 'expert' ? '/expert/forgotPassword' : '/forgotPassword'} className="text-[#db4437] hover:text-[#f55]">
                                Forget Password?
                            </Link>
                        </div>

                        <button type="submit" className="bg-[#db4437] hover:bg-[#f55] text-white py-2 rounded-lg transition-all disabled:opacity-60" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : isUser ? 'Log In' : 'Login as Expert'}
                        </button>
                    </form>

                    {!isUser && (
                        <p className="mt-6 text-sm text-gray-400 text-center">
                            Note: Expert access is limited to authorized personnel only.
                        </p>
                    )}

                    {/* Social Logins */}
                    {isUser && (
                        <>
                            <div className="relative my-6 text-center">
                                <span className="bg-[#1A1A1A] px-4 relative z-10">Or Continue With</span>
                                <div className="absolute left-0 right-0 top-1/2 h-px bg-[#fefeeb] z-0"></div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <Link href="/auth/facebook" className="w-full">
                                    <button className="bg-[#0866FF] hover:bg-[#4285F4] text-white py-2 w-full rounded-md flex items-center justify-center gap-2">
                                        <i className="bi bi-facebook"></i> Facebook
                                    </button>
                                </Link>
                                <Link href="/auth/google" className="w-full">
                                    <button className="bg-[#db4437] hover:bg-[#f55] text-white py-2 w-full rounded-md flex items-center justify-center gap-2">
                                        <i className="bi bi-google"></i> Google
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}

                    <div className="text-center text-sm mt-7">
                        Don&apos;t have an account?
                        <Link href={role === 'expert' ? '/expert/register' : '/register'} className="text-[#db4437] hover:text-[#f55] ml-3 underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


{/* Dots at the bottom */ }
//  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//  <div className="w-6 h-1 bg-white rounded-full"></div>
//  <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
//  <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
//  <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
// </div>