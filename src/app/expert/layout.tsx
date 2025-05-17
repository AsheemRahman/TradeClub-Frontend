"use client"

import ExpertNavbar from "@/components/expert/navbar";
import Footer from "@/components/shared/footer";
import { usePathname } from "next/navigation";

export default function ExpertLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const noSidebarRoutes = ['/expert/login'];
    const showSidebar = !noSidebarRoutes.includes(pathname);

    return (
        <div className="min-h-screen flex flex-col">
            <ExpertNavbar />
            {showSidebar}
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}