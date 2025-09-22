"use client"

import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle, Clock, BookOpen, Volume2, VolumeX, Maximize, Settings, FastForward, Rewind, List, X, Award, TrendingUp, AlertCircle } from 'lucide-react';

import { ICourse, ICourseContent, ICourseProgress, IVideoProgress } from '@/types/courseTypes';
import courseApi from '@/app/service/user/courseApi';
import EnhancedReviewSection from '@/components/shared/reviewSection';


const EnhancedCoursePlayer = () => {
    const { courseId } = useParams() as { courseId: string };
    const [course, setCourse] = useState<ICourse | null>(null);
    const [courseProgress, setCourseProgress] = useState<ICourseProgress | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [savingProgress, setSavingProgress] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const progressRef = useRef<HTMLDivElement | null>(null);
    const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    // Load course data
    useEffect(() => {
        const loadCourseData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [courseData, progressData] = await Promise.all([courseApi.getCourseById(courseId), courseApi.getProgress(courseId)]);
                if (courseData.status) {
                    setCourse(courseData.course);
                }
                if (progressData.status) {
                    setCourseProgress(progressData.progress);
                    // Find the last watched video if progress exists
                    if (progressData.progress && progressData.progress.length > 0) {
                        const lastWatched = progressData.progress.filter((p: IVideoProgress) => p.lastWatchedAt).sort((a: IVideoProgress, b: IVideoProgress) => new Date(b.lastWatchedAt!).getTime() - new Date(a.lastWatchedAt!).getTime())[0];
                        if (courseData.course && lastWatched) {
                            const videoIndex = courseData.course.content.findIndex((content: ICourseContent) => content._id === lastWatched.contentId);
                            if (videoIndex !== -1) {
                                setCurrentVideoIndex(videoIndex);
                            }
                        }
                    }
                }
            } catch (err) {
                setError('Failed to load course data. Please try again.');
                console.error('Error loading course data:', err);
            } finally {
                setLoading(false);
            }
        };
        if (courseId) {
            loadCourseData();
        }
    }, [courseId]);



    // Video event handlers
    const handleVideoLoadedMetadata = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        setDuration(video.duration);
        setVideoLoaded(true);
        // Set initial time from progress if available
        if (courseProgress && course) {
            const currentVideo = course.content[currentVideoIndex];
            if (!currentVideo || !currentVideo._id) return;
            const progress = getVideoProgress(currentVideo._id);
            if (progress && progress.watchedDuration > 0) {
                video.currentTime = progress.watchedDuration;
                setCurrentTime(progress.watchedDuration);
            }
        }
    }, [courseProgress, course, currentVideoIndex]);

    const handleVideoTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime);
    }, []);

    const handleVideoEnded = useCallback(() => {
        setIsPlaying(false);
        handleVideoComplete();
    }, []);

    const handleVideoPlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handleVideoPause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Set up video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
        video.addEventListener('timeupdate', handleVideoTimeUpdate);
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);
        return () => {
            video.removeEventListener('loadedmetadata', handleVideoLoadedMetadata);
            video.removeEventListener('timeupdate', handleVideoTimeUpdate);
            video.removeEventListener('ended', handleVideoEnded);
            video.removeEventListener('play', handleVideoPlay);
            video.removeEventListener('pause', handleVideoPause);
        };
    }, [handleVideoLoadedMetadata, handleVideoTimeUpdate, handleVideoEnded, handleVideoPlay, handleVideoPause]);

    // Reset video when changing videos
    useEffect(() => {
        if (course && course.content[currentVideoIndex]) {
            setVideoLoaded(false);
            setCurrentTime(0);
            setIsPlaying(false);
            const video = videoRef.current;
            if (video) {
                video.currentTime = 0;
                video.load();
            }
        }
    }, [currentVideoIndex, course]);

    // Debounced progress update
    useEffect(() => {
        if (course && currentTime > 0 && videoLoaded) {
            // Clear existing timeout
            if (progressUpdateTimeoutRef.current) {
                clearTimeout(progressUpdateTimeoutRef.current);
            }
            // Set new timeout to update progress after 3 seconds of inactivity
            progressUpdateTimeoutRef.current = setTimeout(() => {
                updateVideoProgress(currentTime);
            }, 3000);
        }
        return () => {
            if (progressUpdateTimeoutRef.current) {
                clearTimeout(progressUpdateTimeoutRef.current);
            }
        };
    }, [currentTime, course, videoLoaded]);

    const handleVideoComplete = useCallback(() => {
        markVideoComplete();
        if (course && currentVideoIndex < course.content.length - 1) {
            setTimeout(() => {
                goToNextVideo();
            }, 2000);
        }
    }, [course, currentVideoIndex]);

    const togglePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(console.error);
        }
    }, [isPlaying]);

    const goToNextVideo = useCallback(() => {
        if (course && currentVideoIndex < course.content.length - 1) {
            updateVideoProgress(currentTime);
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    }, [course, currentVideoIndex, currentTime]);

    const goToPreviousVideo = useCallback(() => {
        if (currentVideoIndex > 0) {
            updateVideoProgress(currentTime);
            setCurrentVideoIndex(currentVideoIndex - 1);
        }
    }, [currentVideoIndex, currentTime]);

    const selectVideo = useCallback((index: number) => {
        if (index !== currentVideoIndex) {
            updateVideoProgress(currentTime);
            setCurrentVideoIndex(index);
        }
    }, [currentVideoIndex, currentTime]);

    const updateVideoProgress = useCallback(async (watchedTime: number, forceComplete: boolean = false) => {
        if (!course || !videoLoaded) return;
        try {
            setSavingProgress(true);
            const currentVideo = course.content[currentVideoIndex];
            if (!currentVideo || !currentVideo._id) return;

            // Fix: Use the actual video duration from the video element, not the course content duration
            const videoDurationInSeconds = duration; // This is already in seconds from video element

            // Determine if completed - either forced or watched 90% of actual video duration
            const isCompleted = forceComplete || (videoDurationInSeconds > 0 && watchedTime >= videoDurationInSeconds * 0.9);

            // If forcing complete, use the full duration as watched time
            const finalWatchedTime = forceComplete ? videoDurationInSeconds : watchedTime;

            // Update progress via API
            const updatedProgress = await courseApi.updateCourseProgress(courseId, currentVideo._id, finalWatchedTime, isCompleted);
            if (updatedProgress?.status) {
                setCourseProgress(updatedProgress.progress);
            } else {
                setCourseProgress((prevProgress) => {
                    const safeContentId = currentVideo._id!;
                    if (!prevProgress) {
                        return {
                            _id: '',
                            user: '',
                            course: courseId,
                            progress: [
                                {
                                    contentId: safeContentId,
                                    watchedDuration: finalWatchedTime,
                                    isCompleted,
                                    lastWatchedAt: new Date().toISOString(),
                                },
                            ],
                            totalCompletedPercent: isCompleted
                                ? (1 / course.content.length) * 100
                                : 0,
                            lastWatchedAt: new Date().toISOString(),
                        };
                    }
                    const newProgress = { ...prevProgress };
                    const existingIndex = newProgress.progress.findIndex(
                        (p) => p.contentId === safeContentId
                    );
                    const videoProgress = {
                        contentId: safeContentId,
                        watchedDuration: finalWatchedTime,
                        isCompleted,
                        lastWatchedAt: new Date().toISOString(),
                    };
                    if (existingIndex >= 0) {
                        newProgress.progress[existingIndex] = videoProgress;
                    } else {
                        newProgress.progress.push(videoProgress);
                    }
                    const completedCount = newProgress.progress.filter((p) => p.isCompleted).length;
                    newProgress.totalCompletedPercent =
                        (completedCount / course.content.length) * 100;
                    newProgress.lastWatchedAt = new Date().toISOString();
                    return newProgress;
                });
            }
        } catch (error) {
            console.error('Failed to update progress:', error);
            setError('Failed to save progress. Please try again.');
        } finally {
            setSavingProgress(false);
        }
    }, [course, currentVideoIndex, courseId, duration, videoLoaded]);

    // Fixed: Mark video as complete using force complete flag
    const markVideoComplete = useCallback(async () => {
        if (!course || !videoLoaded) return;
        const currentVideo = course.content[currentVideoIndex];
        if (!currentVideo || !currentVideo._id) return;

        // Force complete the video regardless of current time
        await updateVideoProgress(duration || currentTime, true);
    }, [course, currentVideoIndex, duration, currentTime, updateVideoProgress, videoLoaded]);

    const getVideoProgress = useCallback((contentId: string) => {
        return courseProgress?.progress.find((p) => p.contentId === contentId) || null;
    }, [courseProgress]);

    const isVideoCompleted = useCallback((contentId: string) => {
        const progress = getVideoProgress(contentId);
        return progress?.isCompleted || false;
    }, [getVideoProgress]);

    const getCompletedVideosCount = useCallback(() => {
        return courseProgress?.progress.filter((p) => p.isCompleted).length || 0;
    }, [courseProgress]);

    const formatTime = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const formatDuration = useCallback((minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }, []);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !videoRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = Math.max(0, Math.min(duration, percent * duration));
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }, [duration]);

    const skip = useCallback((seconds: number) => {
        const video = videoRef.current;
        if (!video || !duration) return;
        const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
        video.currentTime = newTime;
        setCurrentTime(newTime);
    }, [duration]);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(!isMuted);
    }, [isMuted]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;
        const newVolume = Number(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (!fullscreenRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await fullscreenRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    }, []);

    const changePlaybackSpeed = useCallback((speed: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = speed;
        setPlaybackSpeed(speed);
        setShowSpeedMenu(false);
    }, []);

    // Close speed menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (showSpeedMenu) {
                setShowSpeedMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showSpeedMenu]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading course...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-white text-lg mb-4">{error || 'Course not found'}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const currentVideo = course.content[currentVideoIndex];
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#151231] mx-5 rounded-lg">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-md border-b border-white/10 rounded-t-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-xl font-semibold text-white truncate">
                                {course.title}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-300">
                                {getCompletedVideosCount()} / {course.content.length} completed
                            </div>
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${courseProgress?.totalCompletedPercent || 0}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-300">
                                {Math.round(courseProgress?.totalCompletedPercent || 0)}%
                            </span>
                            {savingProgress && (
                                <div className="flex items-center space-x-2 text-sm text-blue-400">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                                    <span>Saving...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className={`grid gap-6 transition-all duration-300 ${showSidebar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {/* Video Player Section */}
                    <div className={`${showSidebar ? 'lg:col-span-2' : 'col-span-1'}`}>
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                            {/* Video Player */}
                            <div ref={fullscreenRef} className="relative aspect-video bg-black group">
                                <video ref={videoRef} src={currentVideo.videoUrl} className="w-full h-full object-cover" onEnded={handleVideoComplete} muted={isMuted}
                                    autoPlay={isPlaying} controls={false}
                                />

                                {/* Video Controls Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => skip(-10)} className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                                                <Rewind className="h-6 w-6 text-white" />
                                            </button>
                                            <button onClick={togglePlayPause} className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                                                {isPlaying ? (<Pause className="h-8 w-8 text-white" />) : (<Play className="h-8 w-8 text-white ml-1" />)}
                                            </button>
                                            <button onClick={() => skip(10)} className="p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                                                <FastForward className="h-6 w-6 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="px-4 py-2 bg-gray-900">
                                <div ref={progressRef} className="w-full bg-gray-700 rounded-full h-2 cursor-pointer" onClick={handleProgressClick}>
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
                                </div>
                            </div>

                            {/* Video Controls */}
                            <div className="p-4 bg-gray-900 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={goToPreviousVideo} disabled={currentVideoIndex === 0} className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button onClick={togglePlayPause} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                                            {isPlaying ? (<Pause className="h-6 w-6" />) : (<Play className="h-6 w-6 ml-1" />)}
                                        </button>
                                        <button onClick={goToNextVideo} disabled={currentVideoIndex === course.content.length - 1}
                                            className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm">{formatTime(currentTime)}</span>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-sm">{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Volume Control */}
                                        <div className="flex items-center space-x-2">
                                            <button onClick={toggleMute} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                                {isMuted || volume === 0 ? (<VolumeX className="h-5 w-5" />) : (<Volume2 className="h-5 w-5" />)}
                                            </button>
                                            <input type="range" min="0" max="1" step="0.1" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                                                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>

                                        {/* Playback Speed */}
                                        <div className="relative">
                                            <button onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                                <Settings className="h-5 w-5" />
                                            </button>
                                            {showSpeedMenu && (
                                                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg p-2 min-w-24 z-10">
                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                                        <button key={speed} onClick={() => changePlaybackSpeed(speed)}
                                                            className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-700 transition-colors ${playbackSpeed === speed ? 'bg-blue-600' : ''}`}
                                                        >
                                                            {speed}x
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Fullscreen */}
                                        <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                            <Maximize className="h-5 w-5" />
                                        </button>
                                        {/* Sidebar Toggle */}
                                        <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" >
                                            {showSidebar ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-gray-800 border-t border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {currentVideo._id ? (
                                            <button
                                                onClick={markVideoComplete}
                                                disabled={savingProgress}
                                                className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                                ${isVideoCompleted(currentVideo._id) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                                <span>
                                                    {savingProgress ? 'Saving...' : (isVideoCompleted(currentVideo._id) ? 'Completed' : 'Mark Complete')}
                                                </span>
                                            </button>
                                        ) : null}
                                        <button onClick={() => setShowNotes(!showNotes)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                                            Notes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            {showNotes && (
                                <div className="p-4 bg-gray-800 border-t border-gray-700">
                                    <h4 className="text-white font-medium mb-2">Lesson Notes</h4>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your notes here..."
                                        className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                                    />
                                </div>
                            )}

                            {/* Video Info */}
                            <div className="p-6 bg-gray-800">
                                <h2 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h2>
                                <div className="flex items-center space-x-6 text-sm text-gray-300 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatDuration(currentVideo.duration)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Lesson {currentVideoIndex + 1} of {course.content.length}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>{Math.round(progressPercentage)}% watched</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <EnhancedReviewSection percentage={courseProgress?.totalCompletedPercent} />
                    </div>

                    {/* Sidebar */}
                    {showSidebar && (
                        <div className="lg:col-span-1">
                            {/* Course Content */}
                            <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 mb-6">
                                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                                    <h3 className="font-semibold text-white mb-2">Course Content</h3>
                                    <p className="text-sm text-gray-300">
                                        {course.content.length} lessons • {formatDuration(course.content.reduce((total, content) => total + content.duration, 0))} total
                                    </p>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {course.content.map((content, index) => {
                                        const isActive = index === currentVideoIndex;
                                        const videoId = content._id;

                                        const progress = videoId ? getVideoProgress(videoId) : null;
                                        const progressPercent = progress && content.duration
                                            ? Math.min((progress.watchedDuration / (content.duration * 60)) * 100, 100)
                                            : 0;

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => selectVideo(index)}
                                                className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all ${isActive ? 'bg-blue-600/20 border-blue-500/30' : ''}`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {videoId && isVideoCompleted(videoId) ? (
                                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                                        ) : (
                                                            <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'border-blue-400 bg-blue-400' : 'border-gray-500'}`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-sm font-medium ${isActive ? 'text-blue-300' : 'text-white'}`}>
                                                            {content.title}
                                                        </h4>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <p className="text-xs text-gray-400">
                                                                {formatDuration(content.duration)}
                                                            </p>
                                                            {progress && (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-16 bg-gray-700 rounded-full h-1">
                                                                        <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full" style={{ width: `${progressPercent}%` }} />
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">
                                                                        {Math.round(progressPercent)}%
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center">
                                    <Award className="h-5 w-5 mr-2 text-yellow-400" />
                                    Course Details
                                </h3>
                                <p className="text-sm text-gray-300 mb-4">{course.description}</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Title:</span>
                                        <span className="font-medium text-white">{course.title}</span>
                                    </div>
                                    {/* <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Category:</span>
                                        <span className="font-medium text-white">{course.category.name}</span>
                                    </div> */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Rating:</span>
                                        <span className="font-medium text-yellow-400">⭐ {course.price || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Customers:</span>
                                        <span className="font-medium text-white">{course.purchasedUsers?.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Progress:</span>
                                        <span className="font-medium text-green-400">
                                            {courseProgress?.totalCompletedPercent || 0}%
                                        </span>
                                    </div>
                                    {/* {courseProgress?.completedAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Completed:</span>
                                            <span className="font-medium text-green-400">
                                                {new Date(courseProgress.completedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {courseProgress?.lastWatchedAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Last Watched:</span>
                                            <span className="font-medium text-white">
                                                {new Date(courseProgress.lastWatchedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnhancedCoursePlayer;