import React from "react";
import { TrendingUp, Shield } from "lucide-react";


const subscription = {
    type: 'free',
    status: 'active',
    endDate: '2024-12-31'
}


const expertConsultation = {
    availableSlots: 3,
    usedSlots: 2,
    totalSlots: 5
}


const QuickStats = () => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Quick Stats
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account Status</span>
                    <span className="font-semibold text-green-400 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Active
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Member Since</span>
                    <span className="font-semibold text-white">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Total Purchases</span>
                    <span className="font-semibold text-white">3</span>
                </div>
                {subscription.type !== "free" && (
                    <div className="flex justify-between">
                        <span className="text-slate-400">Expert Sessions</span>
                        <span className="font-semibold text-white">
                            {expertConsultation.usedSlots}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickStats;
