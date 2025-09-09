"use client"

import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Video, User, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Search, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import sessionApi from '@/app/service/expert/sessionApi';
import { IPaginationMeta, ISession, ISessionFilters } from '@/types/sessionTypes';
import { useRouter } from 'next/navigation';


const ExpertSessionsDashboard: React.FC = () => {
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [pagination, setPagination] = useState<IPaginationMeta>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const router = useRouter()

    const today = new Date().toISOString().split('T')[0];

    // Sort sessions by priority: upcoming/active first, then by start time
    const sortSessionsByTime = (sessions: ISession[]): ISession[] => {
        const now = new Date();
        return [...sessions].sort((a, b) => {
            const aStartTime = a.availabilityId?.startTime;
            const aEndTime = a.availabilityId?.endTime;
            const aDate = a.availabilityId?.date;
            const bStartTime = b.availabilityId?.startTime;
            const bEndTime = b.availabilityId?.endTime;
            const bDate = b.availabilityId?.date;
            if (!aStartTime || !aDate || !bStartTime || !bDate) return 0;
            const aStart = new Date(`${aDate}T${aStartTime}:00`);
            const aEnd = new Date(`${aDate}T${aEndTime}:00`);
            const bStart = new Date(`${bDate}T${bStartTime}:00`);
            const bEnd = new Date(`${bDate}T${bEndTime}:00`);
            // Check if sessions are currently active (between start and end time)
            const aIsActive = now >= aStart && now <= aEnd;
            const bIsActive = now >= bStart && now <= bEnd;
            // Check if sessions are upcoming (start time is in the future)
            const aIsUpcoming = now < aStart;
            const bIsUpcoming = now < bStart;
            // Check if sessions are finished (end time has passed)
            const aIsFinished = now > aEnd;
            const bIsFinished = now > bEnd;
            // Priority order:
            // 1. Active sessions (currently happening) - sorted by start time (earliest first)
            // 2. Upcoming sessions - sorted by start time (earliest first)
            // 3. Finished sessions - sorted by end time (most recently finished first)
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;
            if (aIsActive && bIsActive) {
                // Both active, sort by start time (earliest first)
                return aStart.getTime() - bStart.getTime();
            }
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            if (aIsUpcoming && bIsUpcoming) {
                // Both upcoming, sort by start time (earliest first)
                return aStart.getTime() - bStart.getTime();
            }
            if (aIsFinished && bIsFinished) {
                // Both finished, sort by end time (most recently finished first)
                return bEnd.getTime() - aEnd.getTime();
            }
            // Fallback to start time comparison
            return aStart.getTime() - bStart.getTime();
        });
    };

    const fetchSessions = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            const filterParams: ISessionFilters = {
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(selectedDate && { date: selectedDate }),
                ...(dateRange.start && dateRange.end && {
                    startDate: dateRange.start,
                    endDate: dateRange.end
                }),
                ...(searchTerm && { search: searchTerm })
            };
            const response = await sessionApi.getSessions(page, 10, filterParams);
            if (response.status) {
                // Sort sessions by time-based priority
                const sortedSessions = sortSessionsByTime(response.sessions);
                setSessions(sortedSessions);
                setPagination(response.pagination);
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, selectedDate, dateRange, searchTerm]);

    // Effects
    useEffect(() => {
        fetchSessions(1);
    }, [fetchSessions]);

    // Auto-refresh every minute to update session positions
    useEffect(() => {
        const interval = setInterval(() => {
            if (sessions.length > 0) {
                const sortedSessions = sortSessionsByTime(sessions);
                setSessions(sortedSessions);
            }
        }, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [sessions]);

    // Handlers
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchSessions(page);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSessions(1);
    };

    const handleFilterChange = (filterType: string, value: string) => {
        switch (filterType) {
            case 'status':
                setStatusFilter(value);
                break;
            case 'date':
                setSelectedDate(value);
                setDateRange({ start: '', end: '' });
                break;
            case 'dateRangeStart':
                setDateRange(prev => ({ ...prev, start: value }));
                setSelectedDate('');
                break;
            case 'dateRangeEnd':
                setDateRange(prev => ({ ...prev, end: value }));
                setSelectedDate('');
                break;
        }
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setSelectedDate('');
        setDateRange({ start: '', end: '' });
        setSearchTerm('');
    };

    // Session actions
    const canJoinSession = (session: ISession): boolean => {
        const now = new Date();
        const startTime = session.availabilityId?.startTime;
        const sessionDate = session.availabilityId?.date;
        if (!startTime || !sessionDate) return false;
        const sessionStart = new Date(`${sessionDate}T${startTime}:00`);
        if (isNaN(sessionStart.getTime())) return false;
        const timeDiff = sessionStart.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        return (
            session.status === 'upcoming' &&
            minutesDiff <= 15 &&
            minutesDiff >= -60
        );
    };

    const handleJoinSession = async (session: ISession) => {
        router.push(`/expert/videocall/${session._id}`);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.info("Copy to clipboard")
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    // Utility functions
    const formatTime = (dateString: string): string => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string | Date): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'upcoming':
                return { color: 'bg-blue-100 text-blue-800', icon: AlertCircle };
            case 'completed':
                return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'missed':
                return { color: 'bg-red-100 text-red-800', icon: XCircle };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
        }
    };

    // Get session timing status for visual indicators
    const getSessionTimingStatus = (session: ISession): { status: 'active' | 'upcoming' | 'finished'; label: string; color: string } => {
        const now = new Date();
        const startTime = session.availabilityId?.startTime;
        const endTime = session.availabilityId?.endTime;
        const sessionDate = session.availabilityId?.date;
        if (!startTime || !endTime || !sessionDate) {
            return { status: 'finished', label: 'Unknown', color: 'text-gray-500' };
        }
        const sessionStart = new Date(`${sessionDate}T${startTime}:00`);
        const sessionEnd = new Date(`${sessionDate}T${endTime}:00`);
        if (now >= sessionStart && now <= sessionEnd) {
            return { status: 'active', label: 'Live Now', color: 'text-green-600 animate-pulse' };
        } else if (now < sessionStart) {
            const minutesUntil = Math.round((sessionStart.getTime() - now.getTime()) / (1000 * 60));
            if (minutesUntil < 60) {
                return { status: 'upcoming', label: `Starts in ${minutesUntil}m`, color: 'text-orange-600' };
            } else {
                return { status: 'upcoming', label: 'Upcoming', color: 'text-blue-600' };
            }
        } else {
            const minutesAgo = Math.round((now.getTime() - sessionEnd.getTime()) / (1000 * 60));
            if (minutesAgo < 60) {
                return { status: 'finished', label: `Ended ${minutesAgo}m ago`, color: 'text-gray-500' };
            } else {
                return { status: 'finished', label: 'Ended', color: 'text-gray-500' };
            }
        }
    };

    const getTodaySessions = (): ISession[] => {
        const todaySessions = sessions.filter(session => {
            const sessionDate = session.availabilityId?.date;
            if (!sessionDate) return false;
            return new Date(sessionDate).toISOString().split('T')[0] === today;
        });
        return sortSessionsByTime(todaySessions);
    };

    // Render pagination
    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;
        const pages = [];
        const startPage = Math.max(1, pagination.currentPage - 2);
        const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return (
            <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between flex-1 sm:hidden">
                    <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}
                        className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{' '}
                            <span className="font-medium">
                                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">{pagination.totalItems}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            {pages.map(page => (
                                <button key={page} onClick={() => handlePageChange(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`} >
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && sessions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Appointments</h1>
                                    <p className="text-white/80 text-lg">Manage your scheduled sessions and join meetings</p>
                                </div>
                            </div>
                            <button onClick={() => fetchSessions(pagination.currentPage)} disabled={loading}
                                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search by user name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </form>

                        {/* Status Filter */}
                        <select value={statusFilter} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="all">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                        </select>

                        {/* Single Date Filter */}
                        <input type="date" placeholder="Select date" value={selectedDate} onChange={(e) => handleFilterChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {/* Clear Filters */}
                        <button onClick={clearFilters} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                            Clear Filters
                        </button>
                    </div>

                    {/* Date Range Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" value={dateRange.start} onChange={(e) => handleFilterChange('dateRangeStart', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" value={dateRange.end} onChange={(e) => handleFilterChange('dateRangeEnd', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => { setSelectedDate(today); setDateRange({ start: '', end: '' }); }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedDate === today ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Today
                        </button>
                        <button onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            const tomorrowStr = tomorrow.toISOString().split('T')[0];
                            setSelectedDate(tomorrowStr);
                            setDateRange({ start: '', end: '' });
                        }}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            Tomorrow
                        </button>
                        <button onClick={() => {
                            const nextWeek = new Date();
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            setDateRange({
                                start: today,
                                end: nextWeek.toISOString().split('T')[0]
                            });
                            setSelectedDate('');
                        }}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            Next 7 Days
                        </button>
                    </div>
                </div>

                {/* Today's Sessions Summary */}
                {getTodaySessions().length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Today&apos;s Schedule</h3>
                        <div className="space-y-3">
                            {getTodaySessions().map(session => {
                                const timingStatus = getSessionTimingStatus(session);
                                return (
                                    <div key={session._id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{session.userId.fullName}</div>
                                                <div className="text-sm text-gray-600">
                                                    {formatTime(session.availabilityId.startTime)} - {formatTime(session.availabilityId.endTime)}
                                                </div>
                                                <div className={`text-xs font-medium ${timingStatus.color}`}>
                                                    {timingStatus.label}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {canJoinSession(session) && (
                                                <button onClick={() => handleJoinSession(session)} className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors" >
                                                    <Video className="h-4 w-4 mr-1" />
                                                    Join Now
                                                </button>
                                            )}
                                            {session.meetingLink && (
                                                <button onClick={() => copyToClipboard(session.meetingLink!)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Copy meeting link">
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            All Sessions ({pagination.totalItems})
                        </h2>
                    </div>

                    {sessions.length === 0 ? (
                        <div className="p-8 text-center">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                            <p className="text-gray-600">No sessions match your current filter criteria.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {sessions.map(session => {
                                const statusDisplay = getStatusDisplay(session.status);
                                const StatusIcon = statusDisplay.icon;
                                const joinable = canJoinSession(session);
                                const timingStatus = getSessionTimingStatus(session);

                                return (
                                    <div key={session._id} className={`p-6 hover:bg-gray-50 transition-colors ${timingStatus.status === 'active' ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            {session.userId.profilePicture ? (
                                                                <div className="relative h-12 w-12">
                                                                    <Image src={session.userId.profilePicture} alt={session.userId.fullName} fill className="rounded-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <User className="h-6 w-6 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {session.userId.fullName}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">{session.userId.email}</p>
                                                            <div className={`text-xs font-medium mt-1 ${timingStatus.color}`}>
                                                                {timingStatus.label}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.color}`}>
                                                        <StatusIcon className="h-4 w-4 mr-1" />
                                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        {formatDate(session.availabilityId.date)}
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        {session.availabilityId.startTime} - {session.availabilityId.endTime}
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Video className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        {session.meetingLink ? 'Meeting link available' : 'No meeting link'}
                                                    </div>
                                                </div>

                                                {session.status === 'completed' && session.startedAt && session.endedAt && (
                                                    <div className="mt-3 text-sm text-gray-500">
                                                        Session duration: {Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / (1000 * 60))} minutes
                                                    </div>
                                                )}

                                                <div className="mt-2 text-xs text-gray-500">
                                                    Booked on {formatDate(session.bookedAt)}
                                                </div>
                                            </div>

                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                                                {/* {joinable && session.meetingLink && ( */}
                                                {joinable && (
                                                    <button onClick={() => handleJoinSession(session)} disabled={loading}
                                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Video className="h-4 w-4 mr-2" />
                                                        Join Session
                                                    </button>
                                                )}

                                                {session.status === 'upcoming' && !joinable && (
                                                    <button disabled className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        Not Yet Available
                                                    </button>
                                                )}

                                                {session.meetingLink && (
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => copyToClipboard(session.meetingLink!)} title="Copy link"
                                                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={() => window.open(session.meetingLink, '_blank')} title="Open link"
                                                            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
};

export default ExpertSessionsDashboard;