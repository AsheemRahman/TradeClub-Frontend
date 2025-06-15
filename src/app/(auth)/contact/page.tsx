'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FaYoutube, FaDiscord, FaInstagram, FaTelegram, FaTwitter, FaFacebook } from 'react-icons/fa';


export default function ContactPage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen m-5 text-white flex flex-col md:flex-row p-8 gap-8 font-sans">
            {/* Left Section */}
            <div className="flex-1 space-y-6">
                <h3 className="text-[#E54B00] font-bold">GET IN TOUCH</h3>
                <h1 className="text-4xl font-bold leading-tight">We Are Always Ready<br />To Help You</h1>
                <p className="text-gray-300 max-w-l text-2xl">
                    Is There an Inquiry or Some Feedback for us? Fill out the form to contact our team. We love to hear from you
                </p>

                <div className="border-t border-orange-500 my-4 w-full"></div>

                {/* Contact Details */}
                <div className="space-y-8">
                    {/* Phone */}
                    <div className="flex items-center gap-8">
                        <div className="bg-orange-500 p-5 rounded-md">
                            <Phone />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Phone Number</p>
                            <p>+91 987654321</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-8">
                        <div className="bg-orange-500 p-5 rounded-md">
                            <Mail />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p>tradeclub@gmail.com</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-8">
                        <div className="bg-orange-500 p-5 rounded-md">
                            <MapPin />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Our Location</p>
                            <p>Kerala, India</p>
                        </div>
                    </div>
                    <div className="border-t border-orange-500 my-4 w-full"></div>

                    {/* Social Media Icons */}
                    <div className="flex gap-5 mt-10">
                        <Link href="#" className="bg-[#151231] p-4 rounded-full hover:bg-[#E54B00] ">
                            <FaYoutube className="text-lg text-[#fefeeb]" />
                        </Link>
                        <Link href="#" className="bg-[#151231] p-4 rounded-full hover:bg-[#E54B00] ">
                            <FaDiscord className="text-lg text-[#fefeeb]" />
                        </Link>
                        <Link href="#" className="bg-[#151231] p-4 rounded-full hover:bg-[#E54B00]">
                            <FaInstagram className="text-lg text-[#fefeeb]" />
                        </Link>
                        <Link href="#" className="bg-[#151231] p-4 rounded-full hover:bg-[#E54B00] ">
                            <FaTelegram className="text-lg text-[#fefeeb]" />
                        </Link>
                        <Link href="#" className="bg-[#151231] p-4 rounded-full  hover:bg-[#E54B00]">
                            <FaTwitter className="text-lg text-[#fefeeb]" />
                        </Link>
                        <Link href="#" className="bg-[#151231] p-4 rounded-full hover:bg-[#E54B00] ">
                            <FaFacebook className="text-lg text-[#fefeeb]" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 bg-orange-500 rounded-lg p-8">
                <h2 className="text-4xl font-bold mb-6">Do you have any Queries ?</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="help" placeholder="HOW WE CAN HELP YOU ?" className="w-full p-6 rounded-md text-black font-semibold placeholder-gray-600 bg-[#FCEDE6]" disabled />

                    <div className="flex gap-6 mt-6 ">
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name*" required
                            className="w-1/2 p-4 rounded-md text-black placeholder-gray-600 bg-[#FCEDE6] " />
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name*" required
                            className="w-1/2 p-4 rounded-md text-black placeholder-gray-600 bg-[#FCEDE6] " />
                    </div>

                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your email*" required
                        className="w-full p-4 mt-2 rounded-md text-black placeholder-gray-600 bg-[#FCEDE6] " />

                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message*" required rows={4}
                        className="w-full p-4 mt-2 rounded-md text-black placeholder-gray-600 bg-[#FCEDE6] " />

                    <button type="submit" className="w-full mt-4 bg-[#0a0a23] text-white py-3 rounded-md font-bold hover:opacity-90">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
