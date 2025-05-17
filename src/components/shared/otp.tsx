'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, KeyboardEvent, FormEvent } from 'react';

import { verifyOtp } from '@/app/service/user/userApi';
import { expertVerifyOtp } from '@/app/service/expert/expertApi';


interface OTPProps {
    role: 'user' | 'expert';
}


const OTPVerification: React.FC<OTPProps> = ({ role }) => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState<number>(60);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const inputRefs = useRef<HTMLInputElement[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        setEmail(emailFromQuery ?? '');

        if (emailFromQuery) {
            setTimer(60);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [searchParams]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const fullOtp = Number(otp.join(''));
        if (fullOtp.toString().length !== 6) {
            setError('Please enter a 6-digit OTP');
            setIsLoading(false);
            return;
        }

        try {
            const response = await (role === 'user' ? verifyOtp(fullOtp, email) : expertVerifyOtp(fullOtp, email));
            if (response.status) {
                router.replace('/login')
            } else {
                setError(response.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setIsResendDisabled(true);
            setTimer(30);

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setError('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to resend verification code');
            }
            setIsResendDisabled(false);
        }
    };

    return (
        <>
            <Head>
                <title>Verify Account | TradeClub</title>
                <meta name="description" content="Verify your TradeClub account" />
            </Head>

            <div className="flex flex-col justify-center mb-20">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="mt-15 mb-8 text-center text-4xl font-extrabold ">
                        Verify your account
                    </h1>
                    <div className="mt-2 text-center text-sm text-gray-600">
                        We sent a 6-digit code to
                        <p className="font-medium text-indigo-600">{'your email'}</p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-[#151231] py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter OTP
                                </label>
                                <div className="flex justify-center space-x-4">
                                    {otp.map((digit, index) => (
                                        <input key={index} ref={(ref) => { if (ref) inputRefs.current[index] = ref; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}

                            <div>
                                <button type="submit" disabled={isLoading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="flex items-center justify-center mt-4">
                            <span className="text-sm text-gray-400">Didn’t receive a code?</span>
                            <button type="button" onClick={handleResendOTP} disabled={isResendDisabled} className="ml-2 text-sm font-medium text-indigo-500 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isResendDisabled ? `Resend in ${timer}s` : 'Resend code'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/expert/login" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



export default OTPVerification;