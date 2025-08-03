"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { Irish_Grover } from 'next/font/google';
import { useAuthStore } from '@/store/authStore';

const irishGrover = Irish_Grover({
    weight: '400',
    subsets: ['latin'],
});

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <nav className="bg-[#151231] rounded-[20px] text-white m-5 px-8 py-5">
            <div className="flex justify-between items-center">
                <Link href="/home">
                    <h1 className={`${irishGrover.className} text-white text-[32px] leading-none`}>
                        TradeClub
                    </h1>
                </Link>

                {/* Hamburger Menu Button */}
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Navigation Links (Desktop) */}
                <div className="hidden lg:flex items-center">
                    <div className="flex space-x-8 mr-20">
                        <Link href={user ? '/home' : '/'} className="font-['Allura'] text-lg hover:text-gray-400">Home</Link>
                        <Link href="/courses" className="font-['Allura'] text-lg hover:text-gray-400">Course</Link>
                        <Link href="/my-learning" className="font-['Allura'] text-lg hover:text-gray-400">My-learning</Link>
                        <Link href="/consultation" className="font-['Allura'] text-lg hover:text-gray-400">Consultation</Link>
                        <Link href="/subscription" className="font-['Allura'] text-lg hover:text-gray-400">Subscription</Link>
                        <Link href="/contact" className="font-['Allura'] text-lg hover:text-gray-400">Contact</Link>
                    </div>

                    {/* CTA Buttons */}

                    <div className="flex items-center space-x-4 ml-20">
                        {!user ? (
                            <>
                                <Link href={user ? '/home' : '/'} className="px-4 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] flex items-center font-medium">
                                    Get Started
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <Link href="/login" className="px-6 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] transition-colors font-medium">
                                    Login
                                </Link>
                            </>
                        ) : (
                            <Link href="/profile" className="px-6 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] transition-colors font-medium">
                                Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4 space-y-4">
                    <Link href={user ? '/home' : '/'} className="block text-xl hover:text-gray-300">Home</Link>
                    <Link href="/learning" className="block text-xl hover:text-gray-300">E-Learning</Link>
                    <Link href="/faqs" className="block text-xl hover:text-gray-300">FAQs</Link>
                    <Link href="/contact" className="block text-xl hover:text-gray-300">Contact</Link>
                    <Link href="/resources" className="block text-xl hover:text-gray-300">Resources</Link>
                    <div className="flex flex-col space-y-4 mt-4">
                        <Link href="/" className="px-4 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] font-medium text-center">
                            Get Started
                        </Link>
                        <Link href="/login" className="px-6 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] transition-colors font-medium text-center">
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
