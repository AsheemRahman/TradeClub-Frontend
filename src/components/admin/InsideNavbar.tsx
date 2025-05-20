'use client';

import React from 'react';

interface AdminProductProps {
    title: string;
}

const InsideNavbar: React.FC<AdminProductProps> = ({ title }) => {
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
    }
    return (
        <div className="flex flex-col items-center ">
            <div className="rounded-[10px] py-6 bg-[#151231] w-[100%]">
                <div className="ml-8 flex justify-between items-center gap-5">
                    <h2 className="text-white font-bold text-2xl">{title}</h2>
                    <form onSubmit={handleSearch} className="flex items-center gap-1 mr-8">
                        <input type="text" name="search" placeholder="Search" className="h-[80%] px-10 py-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white" />
                        <button type="submit" value="Search" className="px-4 py-2.5 bg-[#E54B00] text-white rounded hover:bg-[#e54c00a1] transition">Search</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InsideNavbar;
