import { FaChartPie, FaUserFriends, FaUserTie, FaShoppingCart, FaMoneyBillWave, FaGraduationCap, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
    { label: 'Dashboard', icon: <FaChartPie />, active: true },
    { label: 'Customers', icon: <FaUserFriends /> },
    { label: 'Experts', icon: <FaUserTie /> },
    { label: 'Purchases', icon: <FaShoppingCart /> },
    { label: 'Subscription Plan', icon: <FaMoneyBillWave /> },
    { label: 'Course', icon: <FaGraduationCap /> },
    { label: 'Coupons', icon: <FaTicketAlt /> },
    { label: 'Logout', icon: <FaSignOutAlt /> },
];

export default function Sidebar() {
    return (
        <div className="bg-[#151231] w-64 flex flex-col ml-5 p-4 rounded-xl text-white">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`flex items-center jus gap-3 ml- px-4 py-3 my-3 rounded-lg cursor-pointer transition-all ${item.active
                        ? 'bg-orange-500 text-white font-bold'
                        : 'hover:bg-[#1A133A] text-gray-300'
                        }`}
                >
                    <div className='flex gap-5 ml-8'>
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
