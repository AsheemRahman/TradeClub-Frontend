'use client';

import { Suspense } from 'react';
import PaymentFailedContent from './PaymentFailedContent';

export const dynamic = 'force-dynamic';

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
