"use client"

import ExpertNavbar from "@/components/expert/navbar";
import Sidebar from "@/components/expert/sideBar";
import Footer from "@/components/shared/footer";
import { usePathname } from "next/navigation";

export default function ExpertLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const noSidebarRoutes = ['/expert/login', '/expert/register', '/expert/verification', '/expert/verification-pending', '/expert/verify-otp', '/expert/forgotPassword', '/expert/resetPassword'];
    const showSidebar = !noSidebarRoutes.includes(pathname);

    return (
        <div className="min-h-screen flex flex-col">
            <ExpertNavbar />
            <div className="flex">
                {showSidebar && <Sidebar />}
                <main className="flex-grow">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}