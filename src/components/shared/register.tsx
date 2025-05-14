'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';


interface RegisterPageProps {
    role: 'user' | 'expert';
}


const RegisterPage: React.FC<RegisterPageProps> = ({ role }) => {
    console.log(role)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen  flex items-center justify-center px-5">
            <div className="flex bg-[#151231] rounded-[10px] overflow-hidden shadow-lg w-full ">

                {/* Left Image Side */}
                <div className="w-1/2 relative hidden md:block">
                    <Image src="/images/expert-login.jpg" alt="Trade Image" fill className="object-cover h-full w-full" />
                    <div className="absolute top-4 right-4">
                        <Link href="/">
                            <button className="bg-[#E54B00] text-white text-sm px-4 py-2 rounded-[10px] hover:bg-black">
                                Back to website →
                            </button>
                        </Link>
                    </div>
                    {/* <div className="absolute bottom-10 flex flex-col items-center w-full text-white font-bold text-2xl">
                        <p className="text-[#E54B00] mt-2 text-5xl ">Learn knowledge</p>
                        <p className="text-[#E54B00] mt-2 text-5xl ">Earn money</p>
                    </div> */}
                </div>

                {/* Right Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-white text-4xl font-bold mb-2">Be a Trade Expert</h2>
                    <p className="text-gray-400 mb-6">
                        Already have an account? <Link href="/login" className="text-blue-400 underline ml-2  hover:text-[#E54B00]">Login</Link>
                    </p>

                    {/* Form Fields */}
                    <form className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <input type="text" placeholder="First name" required
                                className="w-1/2 p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                            <input type="text" placeholder="Last name" required
                                className="w-1/2 p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                        </div>
                        <input type="email" placeholder="Email" required
                            className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                        <input type="tel" placeholder="Phone Number"
                            className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />

                        {/* Password Field */}
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                            <button type="button" className="absolute top-3 right-4 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" required
                                className="w-full p-3 rounded bg-[#2D2A4A] text-white placeholder-gray-400 focus:outline-none" />
                            <button type="button" className="absolute top-3 right-4 text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Terms */}
                        <div className="my-3 flex items-center ">
                            <input type="checkbox" id="terms" className="h-6 w-6" required />
                            <label htmlFor="terms" className="ml-2 text-l text-gray-300">
                                By Creating An Account You Are Agreeing To Our{" "}
                                <Link href="/terms" className="text-blue-500 hover:underline" >
                                    Terms of Service
                                </Link>{" "}and{" "}
                                <Link href="/privacy" className="text-blue-500 hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg w-full">
                            Register Now
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
                            <button type="button" className="flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md transition duration-200 hover:bg-gray-800">
                                <FcGoogle size={24} className="mr-2" />
                                <span>Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center py-3 px-4 border border-gray-600 rounded-md transition duration-200 hover:bg-gray-800">
                                <FaFacebook size={22} className="mr-2" />
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default RegisterPage;