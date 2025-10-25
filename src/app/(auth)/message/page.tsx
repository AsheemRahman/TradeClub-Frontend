import React, { Suspense } from 'react';
import Chat from './chat';

export default function MessagePage() {
    return (
        <Suspense fallback={<div>Loading chat...</div>}>
            <Chat />
        </Suspense>
    );
}
