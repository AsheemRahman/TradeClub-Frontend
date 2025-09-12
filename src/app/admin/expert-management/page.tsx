'use client';

import { useCallback, useEffect, useState } from 'react';
import { UserType } from '@/types/types';

import { toast } from 'react-toastify';
import { BadgeCheck, Search } from 'lucide-react';
import UserTable from '@/components/admin/TableComponent';

import adminApi from '@/app/service/admin/adminApi';


const UserManagement = () => {
    const [expertData, setExpertData] = useState<UserType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const limit = 7;

    // Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const fetchExperts = useCallback(async () => {
        try {
            const response = await adminApi.getExpertDetails({
                search: debouncedSearch,
                page,
                limit,
            });
            if (response?.status) {
                setExpertData(response.experts);
                setPagination(response.pagination);
            }
        } catch {
            toast.error("Failed to fetch expert data");
        }
    }, [debouncedSearch, page, limit]);

    useEffect(() => {
        fetchExperts();
    }, [fetchExperts]);

    const changeStatus = async (id: string, status: boolean) => {
        const response = await adminApi.expertStatus(id, status);
        if (response.status) fetchExperts();
    };

    return (
        <div>
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                <BadgeCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Expert Management</h1>
                                <p className="text-white/80 mt-1 text-md">Manage Expert , Verify and Approve</p>
                            </div>
                        </div>
                        <div className="relative flex items-center gap-1 mr-5">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search by name or email" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            <UserTable userData={expertData} toggleStatus={changeStatus} role="expert" />

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}
                    className={`px-3 py-1 rounded-lg border transition ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100 border-gray-300"}`}
                >
                    Prev
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button key={pageNumber} onClick={() => setPage(pageNumber)}
                        className={`px-3 py-1 rounded-lg border transition ${page === pageNumber ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100 border-gray-300"}`}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}
                    className={`px-3 py-1 rounded-lg border transition ${page === pagination.totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100 border-gray-300"}`}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default UserManagement;
