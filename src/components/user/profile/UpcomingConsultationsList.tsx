// components/UpcomingConsultationsList.tsx

import React from "react";
import { Calendar, Clock } from "lucide-react";


const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};


const upcomingConsultations = [
    {
        id: 1,
        expertName: 'Dr. Sarah Johnson',
        scheduledAt: '2024-06-05T14:00:00Z',
        duration: 60,
        status: 'scheduled'
    },
    {
        id: 2,
        expertName: 'Prof. Michael Chen',
        scheduledAt: '2024-06-08T10:30:00Z',
        duration: 45,
        status: 'scheduled'
    }
];

const UpcomingConsultationsList = () => {
    if (!upcomingConsultations || upcomingConsultations.length === 0) {
        return (
            <p className="text-slate-400 text-center py-8">
                No upcoming consultations scheduled.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {upcomingConsultations.map((consultation) => (
                <div
                    key={consultation.id}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-200"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-semibold text-white text-lg">
                                {consultation.expertName}
                            </h4>
                            <p className="text-slate-300 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4" />
                                {formatDateTime(consultation.scheduledAt)}
                            </p>
                            <p className="text-slate-300 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {consultation.duration} minutes
                            </p>
                        </div>
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm px-3 py-1 rounded-lg font-medium">
                            {consultation.status}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-400 hover:to-purple-400 transition-all duration-200 font-medium">
                            Join Meeting
                        </button>
                        <button className="border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium">
                            Reschedule
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpcomingConsultationsList;
