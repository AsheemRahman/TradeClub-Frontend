"use client";

import { Suspense } from 'react';
import ExpertDetailsForm from './expertDetailsForm';

export default function VerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExpertDetailsForm />
        </Suspense>
    );
}
