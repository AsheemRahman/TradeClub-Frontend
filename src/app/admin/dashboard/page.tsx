export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg shadow p-6 bg-[#151231]">
                    <h2 className="text-lg font-medium mb-4">Total Customers</h2>
                    <p className="text-3xl font-bold">1,234</p>
                </div>
                <div className="bg-card rounded-lg shadow p-6 bg-[#151231]">
                    <h2 className="text-lg font-medium mb-4">Revenue</h2>
                    <p className="text-3xl font-bold">$12,345</p>
                </div>
                <div className="bg-card rounded-lg shadow p-6 bg-[#151231]">
                    <h2 className="text-lg font-medium mb-4">Active Courses</h2>
                    <p className="text-3xl font-bold">12</p>
                </div>
            </div>
        </div>
    );
}