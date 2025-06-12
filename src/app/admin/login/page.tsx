"use client"

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState, FormEvent } from 'react';
import { loginType } from '@/types/types';
import { toast } from 'react-toastify';

import { loginPost } from '@/app/service/admin/adminApi';


const AdminLogin: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<loginType>({ email: "", password: "" });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginPost(formData);
            if (response.success) {
                toast.success(response.message);
                router.replace('/admin/dashboard');
            }
        } catch (error) {
            console.log("error occurred when fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center my-18">
            <Head>
                <title>Admin Login</title>
                <meta name="description" content="Admin login page" />
            </Head>

            <div className="flex w-full items-center justify-center ">
                {/* Rocket Image Section */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-100 h-100">
                        <Image src="/images/rocket.png" alt="Rocket Ship" fill priority style={{ objectFit: 'contain' }} />
                    </div>
                </div>

                {/* Login Form Section */}
                <div className="flex-1">
                    <div className="bg-[#1e1b36]  rounded-lg shadow-xl p-15 w-[80%]">
                        <h2 className="text-3xl font-bold mb-10 text-white text-center">Admin Login</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-3 py-2 bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-10">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full px-3 py-2 bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-red-600 hover:bg-[#E54B00] text-white font-medium rounded-md "
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
