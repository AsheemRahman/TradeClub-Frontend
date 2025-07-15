import React from 'react';
import { Package } from 'lucide-react';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const subscription = {
    type: 'free',
    status: 'active',
    endDate: '2025-12-31'
}


const SubscriptionCard = () => {
    const isActive = subscription.status === 'active';

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                </div>
                Subscription Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-1">Current Plan</p>
                    <p className="font-bold text-white text-lg capitalize">{subscription.type}</p>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <div className={`font-bold text-lg flex items-center gap-2 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        {subscription.status}
                    </div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-1">Renewal Date</p>
                    <p className="font-bold text-white text-lg">{formatDate(subscription.endDate)}</p>
                </div>
                <button className="bg-slate-700/30 w-full border border-slate-600/50  text-white px-6 py-3 rounded-xl hover:bg-blue-300 hover:text-black transition-all duration-200 font-medium text-lg ">
                    Manage Subscription
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCard;
