'use client';

import ResetPasswordPage from "@/components/shared/newPassword";
import { Suspense } from "react";


const ExpertResetPassword = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage role='expert' />
        </Suspense>
    );
};

export default ExpertResetPassword;