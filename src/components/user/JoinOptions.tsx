"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For App Router

const TradeClubHero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="text-white min-h-screen flex flex-col justify-center items-center ">
            <div className="w-full mx-auto">
                <div className="flex flex-col justify-center items-center gap-26">

                    {/* Customer Section */}
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-8">
                        <div className="max-w-3xl">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 1 : 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-4xl md:text-3xl font-bold text-[#FF5722] mb-4"
                            >
                                Become a Customer
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 1 : 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="text-gray-300 mb-6 text-xl"
                            >
                                &quot;Join TradeClub to level up your trading game—gain access to expert insights, personalized guidance, and a thriving community, all designed to help you grow your skills, make smarter moves, and build confidence in the world of online trading.&quot;
                            </motion.p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="bg-[#FF5722] hover:bg-[#FF7A45] text-white font-medium py-2 px-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                                onClick={() => router.push("/login")}
                            >
                                Be a User
                            </motion.button>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative w-48 h-48 overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5722]/70 to-[#ff9800]/50 mix-blend-overlay" />
                            <Image
                                src="/images/BecomeUser.png"
                                width={192}
                                height={192}
                                alt="Trading expert professional man in suit"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Expert Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-row items-center gap-12" // Made horizontal with gap
                    >
                        {/* Image Box */}
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: -1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative w-58 h-58 overflow-hidden rounded-2xl shadow-2xl flex-shrink-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5722]/70 to-[#ff9800]/50 mix-blend-overlay" />
                            <Image
                                src="/images/BecomeExpert.png"
                                width={192}
                                height={192}
                                alt="Female trading professional"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Text Content */}
                        <div className="max-w-3xl">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 1 : 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="text-2xl md:text-3xl font-bold text-[#FF5722] mb-4"
                            >
                                Become an Expert
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isVisible ? 1 : 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="text-gray-300 mb-6 text-xl"
                            >
                                &quot;Become a trading expert on TradeClub and turn your experience into impact — share valuable insights, offer personalized guidance, and connect with a community of learners eager to grow, while building your reputation and creating new income opportunities in the world of online trading education.&quot;
                            </motion.p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="bg-[#FF5722] hover:bg-[#FF7A45] text-white font-medium py-2 px-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                                onClick={() => router.push("/expert/login")}
                            >
                                Be an Expert
                            </motion.button>
                        </div>
                    </motion.div>


                </div>
            </div>
        </div>
    );
};



export default TradeClubHero;
