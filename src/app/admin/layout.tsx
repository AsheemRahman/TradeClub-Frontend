'use client';

import { usePathname } from 'next/navigation';

import AdminNavbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sideBar";
import Footer from "@/components/shared/footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const hideSidebar = pathname === '/admin/login' || /^\/admin\/expert-management\/[^\/]+$/.test(pathname);

    return (
        <div>
            <AdminNavbar />
            <div className="flex">
                {!hideSidebar && <Sidebar />}
                <main className={`${!hideSidebar ? 'flex-1' : 'w-full'} px-6`}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}