'use client';
export const dynamic = 'force-dynamic';

import OTPVerification from "@/components/shared/otp";

export default function UserOTP() {
    return (
        <OTPVerification role="user" />
    );
}