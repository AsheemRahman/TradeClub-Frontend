'use client';

import { usePathname } from 'next/navigation';

import AdminNavbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sideBar";
import Footer from "@/components/shared/footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noSidebarRoutes = ['/admin/login'];
    const showSidebar = !noSidebarRoutes.includes(pathname);

    return (
        <div>
            <AdminNavbar />
            <div className="flex">
                {showSidebar && <Sidebar />}
                <main className={`${showSidebar ? 'flex-1' : 'w-full'} p-6`}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}