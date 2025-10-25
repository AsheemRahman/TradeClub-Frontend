import React, { Suspense } from 'react';

import PaymentSuccess from './paymentSuccess';

export default function MessagePage() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <PaymentSuccess />
        </Suspense>
    );
}
