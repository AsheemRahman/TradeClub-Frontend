'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle, Clock, BookOpen, } from 'lucide-react';
import { ICourse, ICourseProgress, IVideoProgress } from '@/types/courseTypes';

interface CourseViewPageProps {
    course?: ICourse;
    userId?: string;
}

const CourseViewPage: React.FC<CourseViewPageProps> = ({ course: initialCourse, userId = 'user123' }) => {
    const params = useParams();
    const courseId = params?.courseId as string;

    const [course, setCourse] = useState<ICourse | null>(initialCourse || null);
    const [courseProgress, setCourseProgress] = useState<ICourseProgress | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    const [loading, setLoading] = useState(!initialCourse);
    const [error, setError] = useState<string | null>(null);
    const [savingProgress, setSavingProgress] = useState(false);

    // Mock data for demonstration
    const mockCourse: ICourse = {
        _id: courseId || '1',
        title: 'Complete React Development Course',
        description: 'Master React from basics to advanced concepts including hooks, context, and modern development patterns.',
        price: 99.99,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
        category: 'asdassddsasdas',
        content: [
            {
                _id:"1",
                title: 'Introduction to React',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                duration: 15
            },
            {
                _id:"2",
                title: 'Components and JSX',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                duration: 22
            },
            {
                _id:"3",
                title: 'State and Props',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
                duration: 28
            },
            {
                _id:"4",
                title: 'Event Handling',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                duration: 18
            },
            {
                _id:"5",
                title: 'React Hooks',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                duration: 35
            }
        ],
        isPublished: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:20:00Z'
    };

    const mockProgress: ICourseProgress = {
        _id: 'progress1',
        user: userId,
        course: courseId || '1',
        progress: [
            {
                contentId: '1',
                watchedDuration: 15,
                isCompleted: true,
                lastWatchedAt: new Date().toISOString()
            },
            {
                contentId: '2',
                watchedDuration: 10,
                isCompleted: false,
                lastWatchedAt: new Date().toISOString()
            }
        ],
        totalCompletedPercent: 20,
        lastWatchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    useEffect(() => {
        if (!initialCourse) {
            // Simulate API call
            const fetchCourseData = async () => {
                try {
                    setLoading(true);
                    // Replace with actual API calls
                    // const [courseResponse, progressResponse] = await Promise.all([
                    //     fetch(`/api/courses/${courseId}`),
                    //     fetch(`/api/courses/${courseId}/progress?userId=${userId}`)
                    // ]);
                    // const courseData = await courseResponse.json();
                    // const progressData = await progressResponse.json();

                    // Simulate loading delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setCourse(mockCourse);
                    setCourseProgress(mockProgress);
                } catch (error) {
                    console.log(error)
                    setError('Failed to load course');
                } finally {
                    setLoading(false);
                }
            };

            fetchCourseData();
        } else {
            // If course is provided, still need to fetch progress
            const fetchProgress = async () => {
                try {
                    // const response = await fetch(`/api/courses/${courseId}/progress?userId=${userId}`);
                    // const progressData = await response.json();
                    setCourseProgress(mockProgress);
                } catch (err) {
                    console.error('Failed to load progress:', err);
                }
            };
            fetchProgress();
        }
    }, [courseId, initialCourse, userId]);

    // Auto-save progress every 10 seconds while playing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentVideoTime > 0) {
            interval = setInterval(() => {
                updateVideoProgress(currentVideoTime);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentVideoTime, currentVideoIndex]);

    const updateVideoProgress = async (watchedTime: number) => {
        if (!course || !courseProgress) return;

        const currentVideo = course.content[currentVideoIndex];
        const isCompleted = watchedTime >= currentVideo.duration * 60 * 0.9;

        try {
            setSavingProgress(true);

            const updatedProgress = { ...courseProgress };
            const existingProgressIndex = updatedProgress.progress.findIndex(
                p => p.contentId === currentVideo._id
            );

            const videoProgress: IVideoProgress = {
                contentId: currentVideo._id,
                watchedDuration: watchedTime,
                isCompleted,
                lastWatchedAt: new Date().toISOString()
            };

            if (existingProgressIndex >= 0) {
                updatedProgress.progress[existingProgressIndex] = videoProgress;
            } else {
                updatedProgress.progress.push(videoProgress);
            }

            // Calculate total completion percentage
            const completedCount = updatedProgress.progress.filter(p => p.isCompleted).length;
            updatedProgress.totalCompletedPercent = (completedCount / course.content.length) * 100;
            updatedProgress.lastWatchedAt = new Date().toISOString();

            // If all videos are completed, mark course as completed
            if (completedCount === course.content.length && !updatedProgress.completedAt) {
                updatedProgress.completedAt = new Date().toISOString();
            }

            setCourseProgress(updatedProgress);

            // API call to save progress
            // await fetch(`/api/courses/${courseId}/progress`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         userId,
            //         contentId: currentVideo._id,
            //         watchedDuration: watchedTime,
            //         isCompleted
            //     })
            // });

        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setSavingProgress(false);
        }
    };

    const getVideoProgress = (contentId: string): IVideoProgress | null => {
        return courseProgress?.progress.find(p => p.contentId === contentId) || null;
    };

    const isVideoCompleted = (contentId: string): boolean => {
        const progress = getVideoProgress(contentId);
        return progress?.isCompleted || false;
    };

    const getCompletedVideosCount = (): number => {
        return courseProgress?.progress.filter(p => p.isCompleted).length || 0;
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const goToNextVideo = () => {
        if (currentVideoIndex < (course?.content.length || 0) - 1) {
            // Save current progress before switching
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(currentVideoIndex + 1);
            setIsPlaying(false);
            setCurrentVideoTime(0);
        }
    };

    const goToPreviousVideo = () => {
        if (currentVideoIndex > 0) {
            // Save current progress before switching
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(currentVideoIndex - 1);
            setIsPlaying(false);
            setCurrentVideoTime(0);
        }
    };

    const markVideoComplete = async () => {
        if (!course) return;

        const currentVideo = course.content[currentVideoIndex];
        const totalDurationInSeconds = currentVideo.duration * 60;

        await updateVideoProgress(totalDurationInSeconds);
    };

    const selectVideo = (index: number) => {
        if (index !== currentVideoIndex) {
            // Save current progress before switching
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(index);
            setIsPlaying(false);
            setCurrentVideoTime(0);
        }
    };

    // const handleVideoTimeUpdate = (time: number) => {
    //     setCurrentVideoTime(time);
    // };

    const calculateProgress = () => {
        if (!course?.content.length || !courseProgress) return 0;
        return courseProgress.totalCompletedPercent;
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getTotalDuration = () => {
        if (!course?.content) return 0;
        return course.content.reduce((total, content) => total + content.duration, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error || 'Course not found'}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentVideo = course.content[currentVideoIndex];

    return (
        <div className="min-h-screen bg-gray-50 mx-5 rounded-lg">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900 truncate">
                                {course.title}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                {getCompletedVideosCount()} / {course.content.length} completed
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                            {savingProgress && (
                                <div className="flex items-center space-x-2 text-sm text-blue-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span>Saving...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Video Player */}
                            <div className="relative aspect-video bg-black">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Play className="h-8 w-8 ml-1" />
                                        </div>
                                        <p className="text-lg font-medium">{currentVideo.title}</p>
                                        <p className="text-sm text-gray-300 mt-1">
                                            Duration: {formatDuration(currentVideo.duration)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Video Controls */}
                            <div className="p-4 bg-gray-900 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={goToPreviousVideo}
                                            disabled={currentVideoIndex === 0}
                                            className="p-2 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={togglePlayPause}
                                            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full"
                                        >
                                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                                        </button>
                                        <button
                                            onClick={goToNextVideo}
                                            disabled={currentVideoIndex === course.content.length - 1}
                                            className="p-2 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <button onClick={markVideoComplete}
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isVideoCompleted(currentVideo._id) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>
                                            {isVideoCompleted(currentVideo._id) ? 'Completed' : 'Mark Complete'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatDuration(currentVideo.duration)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Lesson {currentVideoIndex + 1} of {course.content.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Content Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b bg-gray-50">
                                <h3 className="font-semibold text-gray-900">Course Content</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {course.content.length} lessons • {formatDuration(getTotalDuration())} total
                                </p>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {course.content.map((content, index) => (
                                    <div
                                        key={index}
                                        onClick={() => selectVideo(index)}
                                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${index === currentVideoIndex ? 'bg-blue-50 border-blue-200' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {isVideoCompleted(content._id) ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <div className={`w-5 h-5 rounded-full border-2 ${index === currentVideoIndex
                                                        ? 'border-blue-600 bg-blue-600'
                                                        : 'border-gray-300'
                                                        }`}></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium ${index === currentVideoIndex ? 'text-blue-900' : 'text-gray-900'
                                                    }`}>
                                                    {content.title}
                                                </h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-gray-500">
                                                        {formatDuration(content.duration)}
                                                    </p>
                                                    {(() => {
                                                        const progress = getVideoProgress(content._id);
                                                        if (progress && progress.watchedDuration > 0) {
                                                            const watchedMinutes = Math.floor(progress.watchedDuration / 60);
                                                            const progressPercent = Math.min(
                                                                (progress.watchedDuration / (content.duration * 60)) * 100,
                                                                100
                                                            );
                                                            return (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-12 bg-gray-200 rounded-full h-1">
                                                                        <div
                                                                            className="bg-blue-600 h-1 rounded-full"
                                                                            style={{ width: `${progressPercent}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">
                                                                        {formatDuration(watchedMinutes)}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">About this course</h3>
                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium text-gray-900">{course.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Total Duration:</span>
                                    <span className="font-medium text-gray-900">{formatDuration(getTotalDuration())}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Progress:</span>
                                    <span className="font-medium text-gray-900">{Math.round(calculateProgress())}%</span>
                                </div>
                                {courseProgress?.completedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium text-green-600">
                                            {new Date(courseProgress.completedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                {courseProgress?.lastWatchedAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Last Watched:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(courseProgress.lastWatchedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewPage;