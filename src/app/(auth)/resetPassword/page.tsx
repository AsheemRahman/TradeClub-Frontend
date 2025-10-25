'use client';

import React, { Suspense } from 'react';
import ResetPasswordPage from "@/components/shared/newPassword";


const UserResetPassword = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage role='user' />
        </Suspense>
    );
};

export default UserResetPassword;
