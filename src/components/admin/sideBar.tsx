import { adminLogout } from '@/app/service/admin/adminApi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { FaChartPie, FaUserFriends, FaUserTie, FaShoppingCart, FaMoneyBillWave, FaGraduationCap, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';


const menuItems = [
    { label: 'Dashboard', icon: <FaChartPie />, href: '/admin/dashboard', highlighted: true },
    { label: 'Customers', icon: <FaUserFriends />, href: '/admin/user-management' },
    { label: 'Experts', icon: <FaUserTie />, href: '/admin/expert-management' },
    { label: 'Purchases', icon: <FaShoppingCart />, href: '/admin/purchases' },
    { label: 'Subscription Plan', icon: <FaMoneyBillWave />, href: '/admin/subscription' },
    { label: 'Course', icon: <FaGraduationCap />, href: '/admin/Course' },
    { label: 'Coupons', icon: <FaTicketAlt />, href: '/admin/coupons' },
    { label: 'Logout', icon: <FaSignOutAlt /> },
];

export default function Sidebar() {

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        const response = await adminLogout();
        if (response?.status) {
            router.replace('/admin/login');
        }
    };

    return (
        <div className="bg-[#151231] w-64 flex flex-col ml-5 p-4 rounded-xl text-white">
            {menuItems.map((item) => {
                const isActive = item.href && pathname.startsWith(item.href);
                return item.href ? (
                    <Link key={item.label} href={item.href} className={`flex items-center gap-2 px-4 py-4 my-2 rounded-lg cursor-pointer transition-all
                        ${isActive ? 'bg-[#E54B00] text-white font-bold' : 'hover:bg-[#090719] text-3xl text-gray-300'}`}>
                        <div className="flex gap-5 ml-8">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </Link>
                ) : (
                    <button key={item.label} onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 my-3 rounded-lg cursor-pointer transition-all hover:bg-red-600 text-white">
                        <div className="flex gap-5 ml-8">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
