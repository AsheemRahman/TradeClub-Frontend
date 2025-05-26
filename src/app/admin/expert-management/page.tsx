'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserType } from '@/types/types';

import UserTable from '@/components/admin/TableComponent';
import ProductHeader from '@/components/admin/InsideNavbar';

import { getExpertDetails,  expertStatus } from '@/app/service/admin/adminApi';

const UserManagement = () => {
    const [expertData, setExpertData] = useState<UserType[]>([])
    
    const getExperts = async () => {
        try {
            const response = await getExpertDetails()
            if (response.status && response.data?.experts?.length) {
                setExpertData(response.data.experts)
            } else {
                setExpertData([])
            }
        } catch (error) {
            console.log("Error fetching userData", error)
            toast.error("Failed to fetch user data")
        }
    }

    useEffect(() => {
        getExperts();
    }, [])

    const changeStatus = async (id: string, status: boolean) => {
        try {
            if (!id) {
                toast.error("Unable to change the status. Please try again");
                return;
            }
            const response = await expertStatus(id, status)
            if (response.success) {
                toast.success("Expert status changed")
                setExpertData(prev =>
                    prev.map(expert =>
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
            <ProductHeader title="Expert Management" />
            <UserTable userData={expertData} toggleStatus={changeStatus} role='expert' />
        </div>
    );
};

export default UserManagement;
