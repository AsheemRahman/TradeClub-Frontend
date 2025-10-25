'use client';

import { Suspense } from "react";
import OTPVerification from "@/components/shared/otp";

export default function UserOTP() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <OTPVerification role="user" />
        </Suspense>
    );
}