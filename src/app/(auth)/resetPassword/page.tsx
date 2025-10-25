'use client';
export const dynamic = 'force-dynamic';

import ResetPasswordPage from "@/components/shared/newPassword";

const UserResetPassword = () => {
    return <>
        <ResetPasswordPage role='user' />
    </>
};

export default UserResetPassword;