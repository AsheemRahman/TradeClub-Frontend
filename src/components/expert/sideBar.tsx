'use client';

import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { logoutApi } from '@/app/service/shared/sharedApi';
import { useAuthStore } from '@/store/authStore';
import { FaChartPie, FaUserFriends, FaShoppingCart, FaSignOutAlt, FaWallet, FaCalendarAlt, FaComments, } from 'react-icons/fa';

const menuItems = [
    { label: 'Dashboard', icon: <FaChartPie />, href: '/expert/dashboard' },
    { label: 'Appointments', icon: <FaUserFriends />, href: '/expert/appointments' },
    { label: 'Profile', icon: <FaUserFriends />, href: '/expert/profile' },
    { label: 'Session', icon: <FaCalendarAlt />, href: '/expert/session' },
    { label: 'Message', icon: <FaComments />, href: '/expert/message' },
    { label: 'Wallet', icon: <FaWallet />, href: '/expert/wallet' },
    { label: 'Purchases', icon: <FaShoppingCart />, href: '/expert/purchase' },
    { label: 'Rating', icon: <FaShoppingCart />, href: '/expert/rating' },
    { label: 'Logout', icon: <FaSignOutAlt /> },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const authStore = useAuthStore();
    const user = authStore.user;
    const isVerified = user?.role === 'expert' && user.isVerified === 'Approved';

    const restrictedRoutes = [
        '/expert/appointments',
        '/expert/profile',
        '/expert/session',
        '/expert/chat',
        '/expert/wallet',
        '/expert/purchase',
        '/expert/rating',
    ];

    const handleMenuClick = (href: string | undefined) => {
        if (!href) return;
        if (!isVerified && restrictedRoutes.includes(href)) {
            toast.error('Your profile is not verified yet. Access to this section is restricted.');
        } else {
            router.push(href);
        }
    };

    const handleLogout = async () => {
        const response = await logoutApi('expert');
        if (response?.status) {
            authStore.logout();
            await signOut({ callbackUrl: '/expert/login' });
            router.replace('/expert/login');
        }
    };

    return (
        <div className="bg-[#151231] w-64 flex flex-col ml-5 p-4 rounded-xl text-white">
            {menuItems.map((item) => {
                const isActive = item.href && pathname.startsWith(item.href);
                if (item.label === 'Logout') {
                    return (
                        <button key={item.label} onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 my-3 rounded-lg cursor-pointer transition-all hover:bg-red-600 text-white"
                        >
                            <div className="flex gap-5 ml-8">
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </div>
                        </button>
                    );
                }
                return (
                    <div key={item.label} onClick={() => handleMenuClick(item.href)}
                        className={`flex items-center gap-2 px-4 py-4 my-2 rounded-lg cursor-pointer transition-all
                            ${isActive ? 'bg-[#E54B00] text-white font-bold' : 'hover:bg-[#090719] text-3xl text-gray-300'}`}
                    >
                        <div className="flex gap-5 ml-8">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
