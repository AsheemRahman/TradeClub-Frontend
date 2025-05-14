import Link from 'next/link';
import React from 'react';
import { Irish_Grover } from 'next/font/google';

const irishGrover = Irish_Grover({
    weight: '400',
    subsets: ['latin'],
});

export default function AdminNavbar() {
    return (
        <nav className=" bg-[#151231] rounded-[20px] text-white  m-5  px-8 py-6 ">
            <div className="flex justify-between items-center ">
                {/* Logo */}
                <Link href="/admin/dashboard" >
                    <h1 className={`${irishGrover.className} text-white text-[32px] leading-none`} >
                        TradeClub
                    </h1>
                </Link>
            </div>
        </nav>
    );
}