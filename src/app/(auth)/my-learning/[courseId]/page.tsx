'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { ICourse, ICourseProgress, IVideoProgress } from '@/types/courseTypes';
import { getCourseById, getProgress, updateCourseProgress } from '@/app/service/user/userApi';

const CourseViewPage = () => {
    const { courseId } = useParams() as { courseId: string };

    const [course, setCourse] = useState<ICourse | null>(null);
    const [courseProgress, setCourseProgress] = useState<ICourseProgress | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savingProgress, setSavingProgress] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseResponse, progressResponse] = await Promise.all([
                    getCourseById(courseId),
                    getProgress(courseId)
                ]);
                setCourse(courseResponse.course);
                setCourseProgress(progressResponse.progress);
            } catch (error) {
                console.error(error);
                setError('Failed to load course');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying && currentVideoTime > 0) {
                updateVideoProgress(currentVideoTime);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isPlaying, currentVideoTime]);

    const updateVideoProgress = async (watchedTime: number) => {
        if (!course || !courseProgress) return;
        const currentVideo = course.content[currentVideoIndex];
        const isCompleted = watchedTime >= currentVideo.duration * 60 * 0.9;
        try {
            setSavingProgress(true);
            const updatedProgress = { ...courseProgress };
            const index = updatedProgress.progress.findIndex((p) => p.contentId === currentVideo._id);
            const videoProgress: IVideoProgress = {
                contentId: currentVideo._id,
                watchedDuration: watchedTime,
                isCompleted,
                lastWatchedAt: new Date().toISOString(), // 🔧 Fixed
            };
            if (index >= 0) {
                updatedProgress.progress[index] = videoProgress;
            } else {
                updatedProgress.progress.push(videoProgress);
            }
            const completedCount = updatedProgress.progress.filter(p => p.isCompleted).length;
            updatedProgress.totalCompletedPercent = (completedCount / course.content.length) * 100;
            updatedProgress.lastWatchedAt = new Date().toISOString(); // 🔧 Fixed
            if (completedCount === course.content.length && !updatedProgress.completedAt) {
                updatedProgress.completedAt = new Date().toISOString(); // 🔧 Fixed
            }
            setCourseProgress(updatedProgress);
            await updateCourseProgress(courseId, currentVideo._id, watchedTime, isCompleted);
        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setSavingProgress(false);
        }
    };

    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const markVideoComplete = async () => {
        if (!course) return;
        const currentVideo = course.content[currentVideoIndex];
        const totalDurationInSeconds = currentVideo.duration * 60;
        await updateVideoProgress(totalDurationInSeconds);
    };

    const goToNextVideo = () => {
        if (currentVideoIndex < (course?.content.length || 0) - 1) {
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(prev => prev + 1);
            setCurrentVideoTime(0);
            setIsPlaying(false);
        }
    };

    const goToPreviousVideo = () => {
        if (currentVideoIndex > 0) {
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(prev => prev - 1);
            setCurrentVideoTime(0);
            setIsPlaying(false);
        }
    };

    const selectVideo = (index: number) => {
        if (index !== currentVideoIndex) {
            updateVideoProgress(currentVideoTime);
            setCurrentVideoIndex(index);
            setCurrentVideoTime(0);
            setIsPlaying(false);
        }
    };

    const isVideoCompleted = (id: string) => {
        return courseProgress?.progress.find(p => p.contentId === id)?.isCompleted ?? false;
    };

    const getVideoProgress = (id: string) => {
        return courseProgress?.progress.find(p => p.contentId === id) ?? null;
    };

    const calculateProgress = () => {
        if (!course?.content.length || !courseProgress) return 0;
        return courseProgress.totalCompletedPercent;
    };

    const formatDuration = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    };

    if (loading) {
        return <div className="text-white text-center mt-10">Loading...</div>;
    }

    if (error || !course) {
        return <div className="text-red-500 text-center mt-10">{error || 'Course not found'}</div>;
    }

    const currentVideo = course.content[currentVideoIndex];

    return (
        <div className="min-h-screen bg-[#151231] px-4 py-6 text-white">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => window.history.back()} className="bg-white text-black rounded px-3 py-1">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold">{course.title}</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <p>{calculateProgress().toFixed(0)}%</p>
                    <div className="h-2 w-24 bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                    </div>
                    {savingProgress && <span className="text-sm animate-pulse">Saving...</span>}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
                    <video
                        ref={videoRef}
                        src={currentVideo.videoUrl}
                        controls
                        onTimeUpdate={(e) => setCurrentVideoTime(e.currentTarget.currentTime)}
                        onEnded={markVideoComplete}
                        className="w-full rounded"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={goToPreviousVideo} disabled={currentVideoIndex === 0}>
                                <ChevronLeft />
                            </button>
                            <button onClick={togglePlayPause} className="bg-blue-600 px-4 py-2 rounded-full">
                                {isPlaying ? <Pause /> : <Play />}
                            </button>
                            <button onClick={goToNextVideo} disabled={currentVideoIndex === course.content.length - 1}>
                                <ChevronRight />
                            </button>
                        </div>
                        <button
                            onClick={markVideoComplete}
                            className={`px-4 py-2 rounded ${isVideoCompleted(currentVideo._id)
                                ? 'bg-green-600'
                                : 'bg-gray-600'
                                }`}
                        >
                            {isVideoCompleted(currentVideo._id) ? 'Completed' : 'Mark Complete'}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Lessons</h2>
                    {course.content.map((video, idx) => {
                        const progress = getVideoProgress(video._id);
                        const percent = progress ? Math.min((progress.watchedDuration / (video.duration * 60)) * 100, 100) : 0;

                        return (
                            <div
                                key={video._id}
                                onClick={() => selectVideo(idx)}
                                className={`p-3 rounded cursor-pointer mb-2 ${idx === currentVideoIndex ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-medium">{video.title}</h3>
                                        <p className="text-xs text-gray-300">{formatDuration(video.duration)}</p>
                                    </div>
                                    <CheckCircle className={`w-4 h-4 ${isVideoCompleted(video._id) ? 'text-green-500' : 'text-gray-400'}`} />
                                </div>
                                {percent > 0 && (
                                    <div className="h-1 w-full bg-gray-400 rounded-full mt-2">
                                        <div className="h-1 bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseViewPage;