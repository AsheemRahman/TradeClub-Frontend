export default function Dashboard() {
    return (
        <div>
            <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your Chat, Wallet, and Monthly revenue</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Total Customers</h2>
                    <p className="text-3xl font-bold">1,234</p>
                </div>
                <div className="bg-card rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Revenue</h2>
                    <p className="text-3xl font-bold">$12,345</p>
                </div>
                <div className="bg-card rounded-lg shadow p-6 ">
                    <h2 className="text-lg font-medium mb-4">Active Courses</h2>
                    <p className="text-3xl font-bold">12</p>
                </div>
            </div>
        </div>
    );
}