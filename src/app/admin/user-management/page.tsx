'use client';

import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { UserType } from '@/types/types';
import { Search } from 'lucide-react';

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
            <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage user and verify</p>
                </div>
                <div className="relative flex items-center gap-1 mr-5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by name or email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <UserTable userData={filteredUsers} toggleStatus={changeStatus} role="user" />
        </div>
    );
};

export default UserManagement;
