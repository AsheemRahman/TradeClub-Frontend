'use client';

import { Suspense } from "react";
import OTPVerification from "@/components/shared/otp";


export default function ExpertOTP() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <OTPVerification role="expert" />
        </Suspense>
    );
}
