'use client';

import { Search } from 'lucide-react';
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
            <div className="rounded-[10px] py-5 bg-[#151231] w-[100%]">
                <div className="ml-8 flex justify-between items-center gap-5">
                    <h2 className="text-white font-bold text-2xl">{title}</h2>
                    <form onSubmit={handleSearch} className="relative flex items-center gap-1 mr-8">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InsideNavbar;
