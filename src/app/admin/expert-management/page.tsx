'use client';

import { useEffect, useState } from 'react';
import { UserType } from '@/types/types';

import { toast } from 'react-toastify';
import { Search } from 'lucide-react';
import UserTable from '@/components/admin/TableComponent';

import { getExpertDetails, expertStatus } from '@/app/service/admin/adminApi';


const UserManagement = () => {
    const [expertData, setExpertData] = useState<UserType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState<UserType[]>([]);

    const getExperts = async () => {
        try {
            const response = await getExpertDetails();
            if (response.status && response.data?.experts?.length) {
                setExpertData(response.data.experts);
                setFilteredData(response.data.experts);
            } else {
                setExpertData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("Error fetching userData", error);
            toast.error("Failed to fetch user data");
        }
    };

    useEffect(() => {
        getExperts();
    }, []);

    useEffect(() => {
        const filtered = expertData.filter((expert) =>
            expert.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expert.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, expertData]);

    const changeStatus = async (id: string, status: boolean) => {
        try {
            if (!id) {
                toast.error("Unable to change the status. Please try again");
                return;
            }
            const response = await expertStatus(id, status);
            if (response.success) {
                toast.success("Expert status changed");
                setExpertData((prev) =>
                    prev.map((expert) =>
                        expert.id === id ? { ...expert, isActive: status } : expert
                    )
                );
            } else {
                toast.error("Failed to change Expert status");
            }
        } catch (error) {
            console.error("Status change error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div>
            <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Expert Management</h1>
                    <p className="text-gray-600 mt-1">Manage experts and verify</p>
                </div>
                <div className="relative flex items-center gap-1 mr-5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by name or email" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-white bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <UserTable userData={filteredData} toggleStatus={changeStatus} role="expert" />
        </div>
    );
};

export default UserManagement;
