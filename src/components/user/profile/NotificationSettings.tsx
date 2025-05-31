import React from 'react';
import { Settings } from 'lucide-react';


type NotificationKey = 'email' | 'sms' | 'push' | 'expertSlots';


const notificationDescriptions: Record<NotificationKey, string> = {
    email: 'Receive notifications via email',
    sms: 'Receive notifications via SMS',
    push: 'Receive push notifications',
    expertSlots: 'Get notified about available expert slots',
};


const notifications = {
    email: true,
    sms: false,
    push: true,
    expertSlots: true
}


const NotificationSettings = () => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                Notification Settings
            </h3>
            <div className="space-y-6">
                {Object.entries(notifications).map(([key]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between bg-slate-700/30 p-4 rounded-xl border border-slate-600/50"
                    >
                        <div>
                            <p className="font-semibold text-white capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </p>
                            <p className="text-slate-400 text-sm">
                                {notificationDescriptions[key as NotificationKey]}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSettings;
