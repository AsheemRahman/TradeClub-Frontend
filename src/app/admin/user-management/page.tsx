'use client';

import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { UserType } from '@/types/types';
import { Search, User } from 'lucide-react';

import UserTable from '@/components/admin/TableComponent';
import { getUserDetails, userStatus } from '@/app/service/admin/adminApi';


const UserManagement = () => {
    const [userData, setUserData] = useState<UserType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const getUsers = async () => {
        try {
            const response = await getUserDetails();
            if (response.success && response.data?.users?.length) {
                setUserData(response.data.users);
            } else {
                setUserData([]);
            }
        } catch (error) {
            console.error("Error fetching userData", error);
            toast.error("Failed to fetch user data");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const changeStatus = async (id: string, status: boolean) => {
        try {
            if (!id) {
                toast.error("Unable to change the status. Please try again");
                return;
            }
            const response = await userStatus(id, status);
            if (response.success) {
                toast.success("User status changed");
                setUserData(prev => prev.map(user => user.id === id ? { ...user, isActive: status } : user));
            } else {
                toast.error("Failed to change user status");
            }
        } catch (error) {
            console.error("Status change error:", error);
            toast.error("Something went wrong");
        }
    };

    // Filtered data based on search
    const filteredUsers = userData.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
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
                                <p className="text-white/80 mt-2 text-md">Manage customer and verify</p>
                            </div>
                        </div>
                        <div className="relative flex items-center gap-1 mr-5">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search by name or email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            <UserTable userData={filteredUsers} toggleStatus={changeStatus} role="user" />
        </div>
    );
};

export default UserManagement;
