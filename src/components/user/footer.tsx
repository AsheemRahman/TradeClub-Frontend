import React from 'react';
import Link from 'next/link';
import { FaYoutube, FaDiscord, FaInstagram, FaTelegram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Irish_Grover } from 'next/font/google';

const irishGrover = Irish_Grover({
    weight: '400',
    subsets: ['latin'],
});

const UserFooter = () => {
    return (
        <footer className="bg-[#151231] text-white rounded-[20px] m-5 py-10 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top section with logo and social icons */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-6">
                    <h1 className={`${irishGrover.className} text-white text-[32px] leading-none`}>
                        TradeClub
                    </h1>
                    <div className="flex gap-3">
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaYoutube className="text-lg" />
                        </Link>
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaDiscord className="text-lg" />
                        </Link>
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaInstagram className="text-lg" />
                        </Link>
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaTelegram className="text-lg" />
                        </Link>
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaTwitter className="text-lg" />
                        </Link>
                        <Link href="#" className="bg-[#E54B00] p-2 rounded-full">
                            <FaFacebook className="text-lg" />
                        </Link>
                    </div>
                </div>

                {/* Main footer links section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">Quick Links</h3>
                        <ul className="space-y-3 opacity-70 ">
                            <li><Link href="/about">About us</Link></li>
                            <li><Link href="/terms">Term of Service</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/help">Help Center</Link></li>
                            <li className="flex items-center gap-2">
                                <span>English</span>
                                <span className="bg-[#E54B00] text-white rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                                        <path d="M2 12H22" />
                                        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" />
                                    </svg>
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span>Theme</span>
                                <div className="ml-2 bg-gray-600 w-10 h-5 rounded-full flex items-center p-1">
                                    <div className="bg-[#E54B00] w-4 h-4 rounded-full ml-auto"></div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Supports */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">Supports</h3>
                        <ul className="space-y-3 opacity-70 ">
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/faqs">FAQs</Link></li>
                            <li><Link href="/community-support">Community Support</Link></li>
                            <li><Link href="/educations">Educations</Link></li>
                            <li><Link href="/email-support">Email Support</Link></li>
                        </ul>
                    </div>

                    {/* We Provide */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">We Provide</h3>
                        <ul className="space-y-3  opacity-70 ">
                            <li><Link href="/learn-trading">Learn Trading</Link></li>
                            <li><Link href="/videocall">Videocall with expert</Link></li>
                            <li><Link href="/chat">Real-Time Chat</Link></li>
                            <li><Link href="/insights">Trade Insights</Link></li>
                            <li><Link href="/subscription">Subscription Plan</Link></li>
                            <li><Link href="/community">Cummunity Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">Newsletter</h3>
                        <p className="mb-4 opacity-70 ">Never miss any updated about us by subscribing to our newsletter</p>
                        <div className="flex bg-transparent border border-gray-700 rounded-full px-8 py-1.5 " >
                            <input type="email" placeholder="Enter your email" />
                            <button className="bg-[#E54B00] text-white px-6 py-2 rounded-full">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom copyright section */}
                <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-400">
                    <div>© 2024 TradeCall. All Rights Reserved.</div>
                    <div className="flex gap-4">
                        <Link href="/terms">Terms Condition</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;