import Link from 'next/link';
import React from 'react';
import { Irish_Grover } from 'next/font/google';
import { useExpertStore } from '@/store/expertStore';

const irishGrover = Irish_Grover({
    weight: '400',
    subsets: ['latin'],
});


export default function ExpertNavbar() {
    const { expert } = useExpertStore();

    return (
        <>
            <nav className=" bg-[#151231] rounded-[20px] text-white  m-5  px-8 py-5  ">
                <div className="flex justify-between items-center ">
                    {/* Logo */}
                    <Link href="/expert/dashboard" >
                        <h1 className={`${irishGrover.className} text-white text-[32px] leading-none`} >
                            TradeClub
                        </h1>
                    </Link>

                    {/* CTA Buttons */}
                    <div className="flex items-center space-x-4">
                        {!expert && <>
                            <Link href="/expert/login" className="px-4 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] flex items-center font-medium">
                                Get Started
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href="/expert/login" className="px-6 py-2 rounded-md bg-transparent border-2 border-orange-500 text-white hover:bg-[#E54B00] transition-colors font-medium">
                                Login
                            </Link>
                        </>
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}
