'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Search, Grid, List, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { ICourseContent, ICourseProgress, IPurchasedCourse } from '@/types/courseTypes';
import { mockPurchasedCourses } from '@/lib/mockData';


const PurchasedCoursesPage = () => {
    const router = useRouter();
    const [purchasedCourses, setPurchasedCourses] = useState<IPurchasedCourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<IPurchasedCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'alphabetical' | 'purchase-date'>('recent');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchPurchasedCourses = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await fetch(`/api/users/${userId}/purchased-courses`);
                // const data = await response.json();

                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setPurchasedCourses(mockPurchasedCourses);
                setFilteredCourses(mockPurchasedCourses);
            } catch (error) {
                console.log("Failed Fetching Purchased course", error)
                setError('Failed to load purchased courses');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedCourses();
    }, []);

    useEffect(() => {
        let filtered = [...purchasedCourses];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.course.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(item => {
                const progress = item.progress.totalCompletedPercent;
                switch (filterStatus) {
                    case 'completed':
                        return progress === 100;
                    case 'in-progress':
                        return progress > 0 && progress < 100;
                    case 'not-started':
                        return progress === 0;
                    default:
                        return true;
                }
            });
        }

        // Sort courses
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.progress.lastWatchedAt || b.purchaseDate).getTime() -
                        new Date(a.progress.lastWatchedAt || a.purchaseDate).getTime();
                case 'progress':
                    return b.progress.totalCompletedPercent - a.progress.totalCompletedPercent;
                case 'alphabetical':
                    return a.course.title.localeCompare(b.course.title);
                case 'purchase-date':
                    return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
                default:
                    return 0;
            }
        });

        setFilteredCourses(filtered);
    }, [purchasedCourses, searchTerm, filterStatus, sortBy]);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getTotalDuration = (content: ICourseContent[]) => {
        return content.reduce((total, item) => total + item.duration, 0);
    };

    const getProgressStatus = (progress: number) => {
        if (progress === 0) return { text: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' };
        if (progress === 100) return { text: 'Completed', color: 'text-green-600', bg: 'bg-green-100' };
        return { text: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' };
    };

    const getNextLesson = (courseProgress: ICourseProgress, courseContent: ICourseContent[]) => {
        const completedCount = courseProgress.progress.filter(p => p.isCompleted).length;
        if (completedCount >= courseContent.length) return null;
        return courseContent[completedCount];
    };

    const continueCourse = (courseId: string) => {
        router.push(`/my-learning/${courseId}`);
    };

    const getStats = () => {
        const totalCourses = purchasedCourses.length;
        const completedCourses = purchasedCourses.filter(c => c.progress.totalCompletedPercent === 100).length;
        const inProgressCourses = purchasedCourses.filter(c => c.progress.totalCompletedPercent > 0 && c.progress.totalCompletedPercent < 100).length;
        const totalHours = purchasedCourses.reduce((total, c) => total + getTotalDuration(c.course.content), 0);

        return { totalCourses, completedCourses, inProgressCourses, totalHours };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-[#151231] shadow-sm mx-8 rounded-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Learning</h1>
                            <p className="mt-2 text-gray-400">Track your progress and continue learning</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-300"
                            >
                                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#151231] p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm text-gray-100">Total Courses</p>
                                <p className="text-2xl font-bold text-gray-400">{stats.totalCourses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#151231] p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <Award className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm text-gray-100">Completed</p>
                                <p className="text-2xl font-bold text-gray-400">{stats.completedCourses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#151231] p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm text-gray-100">In Progress</p>
                                <p className="text-2xl font-bold text-gray-400">{stats.inProgressCourses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#151231] p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm text-gray-100">Total Hours</p>
                                <p className="text-2xl font-bold text-gray-400">{Math.floor(stats.totalHours / 60)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#151231] p-6 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "in-progress" | "not-started")}
                                className="px-4 py-2 text-white border  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all" className='text-black'>All Courses</option>
                                <option value="completed" className='text-black'>Completed</option>
                                <option value="in-progress" className='text-black'>In Progress</option>
                                <option value="not-started" className='text-black'>Not Started</option>
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "recent" | "progress" | "alphabetical" | "purchase-date")}
                                className="px-4 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="recent" className='text-black'>Recently Watched</option>
                                <option value="progress" className='text-black'>Progress</option>
                                <option value="alphabetical" className='text-black'>Alphabetical</option>
                                <option value="purchase-date" className='text-black'>Purchase Date</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No courses found matching your criteria</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                        {filteredCourses.map((item) => {
                            const { course, progress } = item;
                            const status = getProgressStatus(progress.totalCompletedPercent);
                            const nextLesson = getNextLesson(progress, course.content);
                            const totalDuration = getTotalDuration(course.content);

                            return (
                                <div key={course._id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                                    <div className={viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}>
                                        <div className="relative">
                                            <Image src={course.imageUrl} alt={course.title} width={300} height={160} className="object-cover w-full" />
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </div>
                                            {progress.totalCompletedPercent === 100 && (
                                                <div className="absolute top-3 right-3">
                                                    <Award className="h-6 w-6 text-yellow-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {course.title}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <span className="flex items-center">
                                                <BookOpen className="h-4 w-4 mr-1" />
                                                {course.content.length} lessons
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {formatDuration(totalDuration)}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Progress</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {progress.totalCompletedPercent}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full transition-all duration-300 ${progress.totalCompletedPercent === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                                                    style={{ width: `${progress.totalCompletedPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {nextLesson && (
                                            <div className="text-sm text-gray-600 mb-4">
                                                <span className="font-medium">Next:</span> {nextLesson.title}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                {progress.lastWatchedAt ? (
                                                    <span>Last watched: {new Date(progress.lastWatchedAt).toLocaleDateString()}</span>
                                                ) : (
                                                    <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => continueCourse(course._id)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <PlayCircle className="h-4 w-4" />
                                                <span>
                                                    {progress.totalCompletedPercent === 0 ? 'Start Course' : 'Continue'}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchasedCoursesPage;