'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Search, User } from 'lucide-react';
import UserTable from '@/components/admin/TableComponent';
import { getUserDetails, userStatus } from '@/app/service/admin/adminApi';
import { UserType } from '@/types/types';

const UserManagement = () => {
    const [userData, setUserData] = useState<UserType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

    useEffect(() => {
        const timeout = setTimeout(async () => {
            try {
                const response = await getUserDetails({
                    search: searchQuery,
                    status: statusFilter,
                    sort: sortField,
                    page,
                    limit,
                });
                if (response.status && response) {
                    setUserData(response.users || []);
                    setPagination(response.pagination || { total: 0, totalPages: 0 });
                } else {
                    setUserData([]);
                }
            } catch {
                toast.error("Failed to fetch user data");
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchQuery, statusFilter, sortField, page, limit]);

    const changeStatus = async (id: string, status: boolean) => {
        try {
            const response = await userStatus(id, status);
            if (response.success) {
                toast.success("User status changed");
                setUserData(prev => prev.map(user => user.id === id ? { ...user, isActive: status } : user));
            } else {
                toast.error("Failed to change user status");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Customer Management</h1>
                                <p className="text-white/80 mt-1 text-md">Manage customer and verify</p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex items-center gap-1 mr-5">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search by name or email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 mt-3">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                            <option value="createdAt">Date</option>
                            <option value="fullName">Name</option>
                            <option value="email">Email</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <UserTable userData={userData} toggleStatus={changeStatus} role="user" />

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-6">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className={`px-4 py-2 rounded-lg text-sm font-medium transition 
                    ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    Prev
                </button>
                <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm">
                    Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{pagination.totalPages || 1}</span>
                </span>
                <button disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)} className={`px-4 py-2 rounded-lg text-sm font-medium transition 
                    ${page === pagination.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
