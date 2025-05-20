'use client';

import { useState } from 'react';
import UserTable from '@/components/admin/TableComponent';
import ProductHeader from '@/components/admin/InsideNavbar';

const ExpertManagement = () => {
    const [experts, setExperts] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'active' as const },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', status: 'blocked' as const },
    ]);

    const toggleStatus = (id: number) => {
        setExperts(prev =>
            prev.map(user =>
                user.id === id
                    ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
                    : user
            )
        );
    };

    return (
        <div>
            <ProductHeader title="User Management" />
            <UserTable users={experts} toggleStatus={toggleStatus} page={1} />
        </div>
    );
};

export default ExpertManagement;
