'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserType } from '@/types/types';

import UserTable from '@/components/admin/TableComponent';
import ProductHeader from '@/components/admin/InsideNavbar';

import { getUserDetails, userStatus } from '@/app/service/admin/adminApi';

const UserManagement = () => {
    const [userData, setUserData] = useState<UserType[]>([])

    const getUsers = async () => {
        try {
            const response = await getUserDetails()
            if (response.success && response.data?.users?.length) {
                setUserData(response.data.users)
            } else {
                setUserData([])
            }
        } catch (error) {
            console.log("Error fetching userData", error)
            toast.error("Failed to fetch user data")
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    const changeStatus = async (id: string, status: boolean) => {
        try {
            if (!id) {
                toast.error("Unable to change the status. Please try again");
                return;
            }
            const response = await userStatus(id, status)
            if (response.success) {
                toast.success("User status changed")
                setUserData(prev =>
                    prev.map(user =>
                        user.id === id ? { ...user, isActive: status } : user
                    )
                );
            } else {
                toast.error("Failed to change user status");
            }
        } catch (error) {
            console.error("Status change error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div>
            <ProductHeader title="User Management" />
            <UserTable userData={userData} toggleStatus={changeStatus} role='user' />
        </div>
    );
};

export default UserManagement;
