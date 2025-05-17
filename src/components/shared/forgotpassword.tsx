"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // You can handle API logic here
    };

    return (
        <div className=" m-15 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md bg-[#151231] shadow-2xl rounded-2xl p-8">
                {/* Animated Mail GIF */}
                <div className="flex justify-center mb-6">
                    <Image src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2Fjb21jMG1wYXJ0em9rMW1sZzJodGp6dmt1aHNqcmwyaGZjc2Z6dSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26n6WywJyh39n1pBu/giphy.gif"
                        alt="Mail Animation" width={112} height={112} className="mx-auto mb-6" />
                </div>

                <h2 className="text-3xl font-bold text-center text-white0 mb-4">Forgot Password</h2>
                <p className="text-center text-gray-600 mb-8">
                    Enter your email and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300">
                        Send Reset Link
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
