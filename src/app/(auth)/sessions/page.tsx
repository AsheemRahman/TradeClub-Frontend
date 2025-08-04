'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getSessions } from '@/app/service/user/userApi';

// Types
interface Expert {
    _id: string;
    fullName: string;
    email: string;
    specialization: string;
    profilePicture?: string;
    bio?: string;
    rating?: number;
}

interface ExpertAvailability {
    _id: string;
    startTime: string;
    endTime: string;
    date: string;
}

interface Session {
    _id: string;
    userId: string;
    expertId: Expert;
    availabilityId: ExpertAvailability;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
    updatedAt: string;
}

type SessionStatus = 'upcoming' | 'completed' | 'missed';

const UserSessionsPage = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'missed'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch sessions
    const fetchSessions = async (page: number = 1, status?: string) => {
        try {
            setLoading(true);
            const allowedStatuses: SessionStatus[] = ['upcoming', 'completed', 'missed'];
            const response = await getSessions({ page: page.toString(), limit: '10', ...(allowedStatuses.includes(status as SessionStatus) && { status: status as SessionStatus }), });
            if (!response || !response.status) {
                throw new Error('Failed to fetch sessions');
            }
            setSessions(response.sessions);
            setTotalPages(Math.ceil(response.total / response.limit));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions(currentPage, filter);
    }, [currentPage, filter]);

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: Session['status']) => {
        const statusStyles = {
            upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            missed: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const canJoinMeeting = (session: Session): boolean => {
        if (!session.meetingLink || session.status !== 'upcoming') return false;
        const sessionStart = new Date(session.availabilityId.date + 'T' + session.availabilityId.startTime);
        const now = new Date();
        const fifteenMinutesBefore = new Date(sessionStart.getTime() - 15 * 60 * 1000);
        return now >= fifteenMinutesBefore && now <= sessionStart;
    };

    const formatSessionTime = (session: Session) => {
        const date = new Date(session.availabilityId.date);
        const startTime = session.availabilityId.startTime;
        const endTime = session.availabilityId.endTime;
        return {
            date: format(date, 'MMM dd, yyyy'),
            time: `${startTime} - ${endTime}`,
            dateTime: format(date, 'EEEE, MMMM dd, yyyy'),
        };
    };

    if (loading && sessions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mx-5 rounded-lg">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow p-6">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 mx-5 rounded-lg">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
                    <p className="text-gray-600">Manage and join your booked expert sessions</p>
                </div>
                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {(['all', 'upcoming', 'completed', 'missed'] as const).map((tab) => (
                                <button key={tab} onClick={() => handleFilterChange(tab)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${filter === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                {sessions.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 018 0v4m-4 6v2m0 0v2m0-2h2m-2 0H10m8-11v18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'all' ? "You haven't booked any sessions yet." : `No ${filter} sessions found.`}
                        </p>
                        <div className="mt-6">
                            <Link href="/consultation"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Book a Session
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sessions.map((session) => {
                            const timeInfo = formatSessionTime(session);
                            const canJoin = canJoinMeeting(session);

                            return (
                                <div key={session._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                {/* Expert Avatar */}
                                                <div className="flex-shrink-0 relative h-12 w-12">
                                                    {session.expertId.profilePicture ? (
                                                        <Image src={session.expertId.profilePicture} alt={session.expertId.fullName} fill className="rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {session.expertId.fullName.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Session Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {session.expertId.fullName}
                                                        </h3>
                                                        {getStatusBadge(session.status)}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {session.expertId.specialization}
                                                    </p>

                                                    {session.expertId.rating && (
                                                        <div className="flex items-center mb-3">
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg key={i}  className={`h-4 w-4 ${i < Math.floor(session.expertId.rating!) ? 'text-yellow-400' : 'text-gray-300' }`}
                                                                        fill="currentColor" viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                                <span className="ml-1 text-sm text-gray-600">
                                                                    ({session.expertId.rating.toFixed(1)})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Session Details */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 018 0v4m-4 6v2m0 0v2m0-2h2m-2 0H10m8-11v18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4" />
                                                            </svg>
                                                            <span className="font-medium">{timeInfo.dateTime}</span>
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{timeInfo.time}</span>
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <span>Booked on {format(new Date(session.bookedAt), 'MMM dd, yyyy')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col space-y-2 ml-4">
                                                {session.meetingLink && canJoin && (
                                                    <a href={session.meetingLink}  target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Join Meeting
                                                    </a>
                                                )}

                                                {session.meetingLink && !canJoin && session.status === 'upcoming' && (
                                                    <button disabled  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed" >
                                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                        Meeting Locked
                                                    </button>
                                                )}

                                                <button onClick={() => {/* Add session details modal logic */ }}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Bio (if available) */}
                                        {session.expertId.bio && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {session.expertId.bio}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSessionsPage;