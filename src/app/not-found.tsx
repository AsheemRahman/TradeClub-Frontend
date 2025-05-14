// app/not-found.js
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="relative w-full h-screen">
            <Image src="/images/404.png" alt="404 Not Found" fill className="object-cover" priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button onClick={() => router.back()} className="mt-60 px-6 py-3 bg-[#384354] text-white rounded-md hover:bg-gray-500 transition">
                    Go Back
                </button>
            </div>
        </div>
    );
}
