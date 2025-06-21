'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RegisterFormData } from '@/types/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

import { registerPost } from '@/app/service/shared/sharedApi';
import { useForm } from 'react-hook-form';
import { registerValidation } from '@/app/utils/Validation';
import { useAuthStore } from '@/store/authStore';


interface RegisterPageProps {
    role: 'user' | 'expert';
}


const RegisterPage: React.FC<RegisterPageProps> = ({ role }) => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, } = useForm<RegisterFormData>();

    const router = useRouter();
    const authStore = useAuthStore();

    useEffect(() => {
        const alreadyLoggedIn = authStore.user !== null;
        if (alreadyLoggedIn) {
            router.replace(role == "user" ? '/home' : '/expert/dashboard');
        }
    }, [authStore.user, role, router])

    const onSubmit = async (data: RegisterFormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...data, role };
            const response = await registerPost(payload);
            if (response?.email) {
                toast.success(response.message || "Registration successful!");
                const otpPath = role === 'user' ? '/verify-otp' : '/expert/verify-otp';
                router.replace(`${otpPath}?email=${response.email}&type=register`);
            }
        } catch (err) {
            console.error("error in register", err);
            toast.error("Something went wrong during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" flex items-center justify-center px-5">
            <div className="flex bg-[#151231] rounded-[10px] overflow-hidden shadow-lg w-full ">

                {/* Left Image Side */}
                <div className="w-1/2 relative hidden md:block">
                    <Image src={role === 'expert' ? "/images/expert-login1.jpg" : "/images/expert-login.jpg"} alt="Trade Image" fill className="object-cover h-full w-full" />
                    <div className="absolute top-4 right-4">
                        <Link href={role === 'expert' ? '/expert/dashboard' : '/'}>
                            <button className="bg-[#E54B00] text-white text-sm px-4 py-2 rounded-[10px] hover:bg-black">
                                Back to website →
                            </button>
                        </Link>
                    </div>
                    {role === 'expert' ? (
                        <div className="absolute bottom-10 flex flex-col items-center w-full text-white font-extrabold text-2xl">
                            <p className="text-[#E54B00] mt-2 text-5xl ">Join</p>
                            <p className="text-[#E54B00] mt-2 text-5xl ">As a Expert</p>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>

                {/* Right Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-8">
                    <h2 className="text-white text-4xl font-bold mb-2">
                        {role === 'expert' ? 'Be a Trade Expert' : 'Join as a Trader'}
                    </h2>
                    <p className="text-gray-400 mb-4">
                        Already have an account? <Link href={role === 'expert' ? '/expert/login' : '/login'} className="text-blue-400 underline ml-2  hover:text-[#E54B00]">Login</Link>
                    </p>

                    {/* Form Fields */}
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Full Name" {...register("fullName", registerValidation.fullName)} className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

                        <input placeholder="Email" {...register("email", registerValidation.email)} className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        <input type="tel" placeholder="Phone Number" {...register("phoneNumber", registerValidation.phoneNumber)} className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}

                        {/* Password Field */}
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...register("password", registerValidation.password)}
                                className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-4 text-gray-400">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password"
                                {...register("confirmPassword", { ...registerValidation.confirmPassword, validate: (value) => value === watch('password') || "Passwords do not match", })}
                                className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-3 right-4 text-gray-400">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {errors.confirmPassword && (<p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>)}
                        </div>

                        {/* Terms */}
                        <div className="my-3 flex items-center ">
                            <input type="checkbox" id="terms" className="h-6 w-6" {...register("checkBox", registerValidation.checkBox)} />
                            <label htmlFor="terms" className="ml-4 text-m text-gray-300">
                                By Creating An Account You Are Agreeing To Our{" "}
                                <Link href="/terms" className="text-blue-500 hover:underline" >
                                    Terms of Service
                                </Link>{" "}and{" "}
                                <Link href="/privacy" className="text-blue-500 hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>
                        {errors.checkBox && <p className="text-red-500 text-sm">{errors.checkBox.message}</p>}

                        {/* Submit Button */}
                        <button type="submit" disabled={loading} className={`bg-[#E54B00] text-white font-bold py-3 rounded-lg w-full ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#e54c00d8]'}`}>
                            {loading ? 'Registering...' : 'Register Now'}
                        </button>
                    </form>

                    <div>
                        {/* Or register with */}
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-600"></div>
                            <span className="mx-2 text-gray-400 text-sm">Or register with</span>
                            <div className="flex-grow border-t border-gray-600"></div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center py-3 px-4 border border-gray-400 rounded-md transition duration-200 hover:bg-gray-800">
                                <FcGoogle size={24} className="mr-2" />
                                <span className='text-white'>Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center  py-3 px-4 border border-gray-400 rounded-md transition duration-200 hover:bg-gray-800">
                                <FaFacebook size={22} className="mr-2 text-blue-600" />
                                <span className='text-white'>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default RegisterPage;