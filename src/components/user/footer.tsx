import React from 'react';
import Link from 'next/link';
import { FaYoutube, FaDiscord, FaInstagram, FaTelegram, FaTwitter, FaFacebook, } from 'react-icons/fa';
import { Irish_Grover } from 'next/font/google';


const irishGrover = Irish_Grover({
    weight: '400',
    subsets: ['latin'],
});


const UserFooter = () => {
    return (
        <footer className="bg-[#151231] text-white rounded-[20px] m-5 py-10 px-6 sm:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top section with logo and social icons */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-6 gap-4">
                    <h1 className={`${irishGrover.className} text-white text-[32px] leading-none`}>
                        TradeClub
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[FaYoutube, FaDiscord, FaInstagram, FaTelegram, FaTwitter, FaFacebook].map((Icon, index) => (
                            <Link key={index} href="#" className="bg-[#E54B00] p-2 rounded-full hover:opacity-70">
                                <Icon className="text-lg" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main footer links section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 px-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">Quick Links</h3>
                        <ul className="space-y-3 opacity-70">
                            <li className="hover:opacity-60"><Link href="/about">About us</Link></li>
                            <li className="hover:opacity-60"><Link href="/terms">Term of Service</Link></li>
                            <li className="hover:opacity-60"><Link href="/privacy">Privacy Policy</Link></li>
                            <li className="hover:opacity-60"><Link href="/help">Help Center</Link></li>
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
                        <ul className="space-y-3 opacity-70">
                            <li className="hover:opacity-60"><Link href="/contact">Contact</Link></li>
                            <li className="hover:opacity-60"><Link href="/faqs">FAQs</Link></li>
                            <li className="hover:opacity-60"><Link href="/community-support">Community Support</Link></li>
                            <li className="hover:opacity-60"><Link href="/educations">Educations</Link></li>
                            <li className="hover:opacity-60"><Link href="/email-support">Email Support</Link></li>
                        </ul>
                    </div>

                    {/* We Provide */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">We Provide</h3>
                        <ul className="space-y-3 opacity-70">
                            <li className="hover:opacity-60"><Link href="/learn-trading">Learn Trading</Link></li>
                            <li className="hover:opacity-60"><Link href="/videocall">Videocall with expert</Link></li>
                            <li className="hover:opacity-60"><Link href="/chat">Real-Time Chat</Link></li>
                            <li className="hover:opacity-60"><Link href="/insights">Trade Insights</Link></li>
                            <li className="hover:opacity-60"><Link href="/subscription">Subscription Plan</Link></li>
                            <li className="hover:opacity-60"><Link href="/community">Community Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-medium text-[#E54B00] mb-4">Newsletter</h3>
                        <p className="mb-4 opacity-70">Never miss any update about us by subscribing to our newsletter</p>
                        <form className="flex flex-col sm:flex-row items-stretch sm:items-center">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 border-l border-t border-b border-gray-500 rounded-l-xl  text-white outline-none w-full" />
                            <button type="submit" className="bg-[#E54B00] text-white px-6 py-2 border-r border-t border-b border-gray-500 rounded-r-xl w-full sm:w-auto">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom copyright section */}
                <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-2">
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