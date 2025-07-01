import { BarChart3 } from "lucide-react";

export default function Dashboard() {
    return (
        <div>
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                                <p className="text-white/80 mt-1 text-md">Manage your Chat, Wallet, and Monthly revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-lg shadow p-6 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                    <h2 className="text-lg font-medium mb-4">Total Customers</h2>
                    <p className="text-3xl font-bold">1,234</p>
                </div>
                <div className="rounded-lg shadow p-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                    <h2 className="text-lg font-medium mb-4">Revenue</h2>
                    <p className="text-3xl font-bold">$12,345</p>
                </div>
                <div className="rounded-lg shadow p-6 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white">
                    <h2 className="text-lg font-medium mb-4">Active Courses</h2>
                    <p className="text-3xl font-bold">12</p>
                </div>
            </div>

        </div>
    );
}