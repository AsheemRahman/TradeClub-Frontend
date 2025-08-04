import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { getSessions } from "@/app/service/user/userApi";
import { typeSession } from "@/types/sessionTypes";


const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const UpcomingConsultationsList = () => {
    const [consultations, setConsultations] = useState<typeSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const fetchConsultations = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await getSessions({
                page: currentPage.toString(),
                limit: limit.toString(),
                status: "upcoming"
            });

            if (response.status) {
                setConsultations(response.sessions);
                setTotalPages(response.totalPages || 1);
            } else {
                setConsultations([]);
            }
        } catch (error) {
            console.log("Error fetching consultations", error);
            setError("Failed to fetch consultations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultations(page);
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    if (loading) {
        return <p className="text-slate-400 text-center py-8">Loading consultations...</p>;
    }

    if (error) {
        return <p className="text-red-400 text-center py-8">{error}</p>;
    }

    if (!consultations || consultations.length === 0) {
        return (
            <p className="text-slate-400 text-center py-8">
                No upcoming consultations scheduled.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {consultations.map((consultation) => (
                <div key={consultation._id} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="font-semibold text-white text-lg">
                                {consultation.expertId.fullName}
                            </h4>
                            <p className="text-slate-300 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4" />
                                {formatDateTime(consultation.availabilityId.date)}
                            </p>
                            <p className="text-slate-300 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {(() => {
                                    const [startHour, startMinute] = consultation.availabilityId.startTime.split(":").map(Number);
                                    const [endHour, endMinute] = consultation.availabilityId.endTime.split(":").map(Number);
                                    const startTotalMinutes = startHour * 60 + startMinute;
                                    const endTotalMinutes = endHour * 60 + endMinute;
                                    return `${endTotalMinutes - startTotalMinutes} minutes`;
                                })()}
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
                        {/* <button className="border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium">
                            Reschedule
                        </button> */}
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {consultations.length > limit && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button onClick={handlePrev} disabled={page === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 transition-all duration-200 ${page === 1 ? "text-slate-500 cursor-not-allowed" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                    >
                        Previous
                    </button>
                    <span className="text-slate-300">
                        Page {page} of {totalPages}
                    </span>
                    <button onClick={handleNext} disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 transition-all duration-200 ${page === totalPages ? "text-slate-500 cursor-not-allowed" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpcomingConsultationsList;
