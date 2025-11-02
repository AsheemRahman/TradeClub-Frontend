import Link from 'next/link';
import { usePathname } from 'next/navigation';
import adminApi from '@/app/service/admin/adminApi';

import { FaChartPie, FaUserFriends, FaUserTie, FaShoppingCart, FaMoneyBillWave, FaGraduationCap, FaTicketAlt, FaSignOutAlt, FaFolderOpen, FaMoneyCheckAlt } from 'react-icons/fa';
import { Crown } from 'lucide-react';


const menuItems = [
    { label: 'Dashboard', icon: <FaChartPie />, href: '/admin/dashboard', highlighted: true },
    { label: 'Customers', icon: <FaUserFriends />, href: '/admin/user-management' },
    { label: 'Experts', icon: <FaUserTie />, href: '/admin/expert-management' },
    { label: 'Course Category', icon: <FaFolderOpen />, href: '/admin/category' },
    { label: 'Course', icon: <FaGraduationCap />, href: '/admin/course' },
    { label: 'Subscription Plan', icon: <FaMoneyBillWave />, href: '/admin/subscription' },
    { label: 'Purchases', icon: <FaShoppingCart />, href: '/admin/purchases' },
    { label: 'Payout', icon: <FaMoneyCheckAlt />, href: '/admin/payout' },
    { label: 'Coupons', icon: <FaTicketAlt />, href: '/admin/coupon' },
    { label: 'Logout', icon: <FaSignOutAlt /> },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        const response = await adminApi.adminLogout();
        if (response?.status) {
            window.location.href = "/admin/login";
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: '#151231' }} className="w-72 flex flex-col ml-5 rounded-lg text-white shadow-2xl overflow-hidden">

                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 mb-4">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                            <p className="text-white/80 text-sm">Manage your platform</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 px-6 pb-6">
                    <nav className="space-y-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            if (item.href) {
                                return (
                                    <Link key={item.label} href={item.href} className='gap-10'>
                                        <div className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
                                            ${isActive ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/25' : 'hover:bg-purple-900/30 text-gray-300 hover:text-white'}`}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 animate-pulse"></div>
                                            )}
                                            <div className="relative z-10 flex items-center gap-4 w-full">
                                                <div className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                                    <span className="text-xl">{item.icon}</span>
                                                </div>
                                                <span className="text-sm font-medium">{item.label}</span>
                                                {isActive && (
                                                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            } else {
                                return (
                                    <button key={item.label} onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 group hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-transparent hover:border-red-500/30"
                                    >
                                        <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                                            <span className="text-xl">{item.icon}</span>
                                        </div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                );
                            }
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}