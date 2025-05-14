import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart2, LineChart, Users, Globe, DollarSign, Briefcase, PieChart } from 'lucide-react';

// Animated particles background
const ParticlesBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white/10 rounded-full"
                    style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.3,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(20px); }
          75% { transform: translateY(10px) translateX(-10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .absolute {
          animation: float 15s linear infinite;
        }
      `}</style>
        </div>
    );
};


interface TypewriterEffectProps {
    text: string;
}

const TypewriterEffect: FC<TypewriterEffectProps> = ({ text }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= text.length) {
                setDisplayText(text.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 150); // Faster typing speed

        return () => clearInterval(timer);
    }, [text]);

    return (
        <span className="inline-block">
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

const BackgroundEffect = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/30 to-blue-900/30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-green-800/20 blur-2xl" />
        <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb10" strokeWidth="1"></path>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
        </div>
    </div>
);

const StockChart = () => (
    <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
            <path
                d="M0,50 L50,55 L100,45 L150,70 L200,60 L250,80 L300,65 L350,75 L400,50 L450,60 L500,40 L550,50 L600,35 L650,45 L700,30 L750,50 L800,35 L850,55 L900,45 L950,60 L1000,40"
                stroke="rgb(16, 185, 129)"
                strokeWidth="2"
                fill="none"
            />
            <path
                d="M0,70 L50,75 L100,65 L150,80 L200,70 L250,90 L300,75 L350,85 L400,60 L450,70 L500,50 L550,60 L600,45 L650,55 L700,40 L750,60 L800,45 L850,65 L900,55 L950,70 L1000,50"
                stroke="rgb(37, 99, 235)"
                strokeWidth="2"
                fill="none"
            />
        </svg>
    </div>
);

interface IconButtonProps {
    Icon: React.ElementType;
    delay: number;
}

const IconButton: FC<IconButtonProps> = ({ Icon, delay }) => (
    <motion.div
        className="relative group hover:scale-110 transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay / 1000, duration: 0.5 }}
    >
        <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300" />
        <div className="relative p-3 md:p-4 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
        </div>
    </motion.div>
);

interface WelcomeScreenProps {
    onLoadingComplete: () => void;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({ onLoadingComplete }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // 5 seconds to complete

        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
                if (onLoadingComplete) onLoadingComplete();
            }, 1000);
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [onLoadingComplete]);

    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: {
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
            transition: {
                duration: 0.8,
                ease: "easeInOut",
            }
        }
    };

    const iconSet = [TrendingUp, BarChart2, DollarSign, LineChart, PieChart, Briefcase, Users];

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 bg-[#031427] z-50"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <BackgroundEffect />
                    <ParticlesBackground />
                    <StockChart />

                    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
                        <div className="w-full max-w-4xl mx-auto">
                            {/* Icons */}
                            <motion.div
                                className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12"
                            >
                                {iconSet.map((Icon, index) => (
                                    <IconButton key={index} Icon={Icon} delay={(200 + index * 150)} />
                                ))}
                            </motion.div>

                            {/* Welcome Text */}
                            <div className="text-center mb-8 sm:mb-10 md:mb-12">
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold space-y-2 sm:space-y-4">
                                    <div className="mb-2 sm:mb-4">
                                        <motion.span
                                            className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-green-200 bg-clip-text text-transparent"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                        >
                                            Welcome
                                        </motion.span>
                                        <motion.span
                                            className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-green-200 bg-clip-text text-transparent"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                        >
                                            To
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 md:gap-4">
                                        <motion.span
                                            className="inline-block px-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                        >
                                            TradeClub
                                        </motion.span>
                                    </div>
                                </h1>

                                <motion.p
                                    className="text-gray-300 mt-4 md:text-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                >
                                    <span className="text-green-400">Connect</span> · <span className="text-blue-400">Trade</span> · <span className="text-green-400">Earn</span>
                                </motion.p>
                            </div>

                            {/* Website Link */}
                            <motion.div
                                className="text-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.5 }}
                            >
                                <a href="#" className="inline-flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-4 rounded-full relative group hover:scale-105 transition-transform duration-300" target="_blank" rel="noopener noreferrer">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-blue-600/40 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                                    <div className="relative flex items-center gap-3 text-xl sm:text-2xl md:text-3xl">
                                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                            <TypewriterEffect text="www.tradeclub.com" />
                                        </span>
                                    </div>
                                </a>
                            </motion.div>

                            {/* Progress Bar */}
                            <motion.div
                                className="w-64 sm:w-80 md:w-96 mx-auto mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-100"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-2 text-center text-xs text-gray-400">
                                    {progress < 100 ? 'Loading your financial future...' : 'Ready to trade!'}
                                </div>
                            </motion.div>

                            {/* Market Stats Teaser */}
                            <motion.div
                                className="flex justify-center gap-4 sm:gap-8 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6, duration: 0.5 }}
                            >
                                {[{ label: 'USERS', value: '12K+' }, { label: 'TRADES', value: '245K+' }, { label: 'PROFIT', value: '$1.2M+' }].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-xs text-gray-400">{stat.label}</div>
                                        <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeScreen;