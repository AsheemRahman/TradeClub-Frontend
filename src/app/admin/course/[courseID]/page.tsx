'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Play, Users, Star, BarChart3, Activity, FileText, Video, Loader2, AlertCircle, IndianRupee, } from 'lucide-react';
import { ICourse, ICategory, ICourseFormData } from '@/types/courseTypes';
import { deleteCourse, getCategory, getCourseByID, togglePublish } from '@/app/service/admin/courseApi';
import CourseModal from '@/components/admin/CourseModal';

const AdminCourseDetail = () => {
    const params = useParams<{ courseID: string }>();
    const courseId = params?.courseID;
    const router = useRouter();
    const [course, setCourse] = useState<ICourse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics' | 'users'>('overview');
    const [expandedContent, setExpandedContent] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    // Modal states
    const [showModal, setShowModal] = useState<boolean>(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [formData, setFormData] = useState<ICourseFormData>({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        content: [],
        isPublished: false
    });

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);
            const [courseRes, categoriesRes] = await Promise.all([getCourseByID(courseId), getCategory()]);
            if (!courseRes.status || !categoriesRes.status) {
                throw new Error('Failed to fetch data');
            }
            setCourse(courseRes.course || []);
            setCategories(categoriesRes.categories || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        if (!course) return;
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            category: course.category,
            content: course.content.map(item => ({
                _id:item._id,
                title: item.title,
                videoUrl: item.videoUrl,
                duration: item.duration
            })),
            isPublished: course.isPublished
        });
        setShowModal(true);
    };

    const handleTogglePublish = async () => {
        if (!course) return;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${course.isPublished ? 'unpublish' : 'publish'} this course?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: course.isPublished ? '#d33' : '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${course.isPublished ? 'unpublish' : 'publish'} it!`,
        });
        if (result.isConfirmed) {
            try {
                const response = await togglePublish(courseId);
                if (response.status) {
                    setCourse({ ...course, isPublished: !course.isPublished });
                    toast.success(`Course ${course.isPublished ? 'unpublished' : 'published'} successfully`);
                }
            } catch (error) {
                console.error("error in toggle", error)
                toast.error('Failed to update course status');
            }
        }
    };

    const handleDelete = async () => {
        if (!course) return;
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                const response = await deleteCourse(courseId);
                if (response.status) {
                    toast.success('Course deleted successfully');
                    router.push('/admin/course');
                }
            } catch (error) {
                console.error("error in delete", error)
                toast.error('Failed to delete course');
            }
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const calculateTotalDuration = () => {
        if (!course?.content) return 0;
        return course.content.reduce((total, item) => total + item.duration, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span className="text-white">Loading course details...</span>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
                    <p className="text-gray-400 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
                    <button onClick={() => router.push('/admin/course')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            {/* <div className="bg-[#151231] border-b rounded-t-xl border-gray-800"> */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-t-xl shadow-2xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => router.push('/admin/course')} className="flex relative items-center gap-2 text-gray-900 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                            Back to Courses
                        </button>

                        <div className="flex relative items-center gap-3">
                            <button onClick={handleEditClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <Edit size={16} />
                                Edit
                            </button>
                            <button onClick={handleTogglePublish}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${course.isPublished
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {course.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                {course.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Course Info */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-sm text-sm font-medium ${course.isPublished
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-sm text-sm">
                                    {categories.find(cat => course?.category === cat._id)?.categoryName || 'Unknown'}
                                </span>
                            </div>
                            <h1 className="relative text-4xl font-bold text-white mb-4">{course.title}</h1>
                            <p className="relative text-xl text-gray-300 mb-6">{course.description}</p>
                        </div>

                        {/* Course Image */}
                        <div className="lg:col-span-1">
                            <div className="relative">
                                <Image src={course.imageUrl} alt={course.title} width={300} height={200} className="w-full h-48 object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center rounded-lg ">
                                    <div className="text-center text-white">
                                        <div className="text-2xl font-bold">{course.price}</div>
                                        <div className="text-sm">Course Price</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="border-b border-gray-800 mb-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: FileText },
                            { id: 'content', label: 'Course Content', icon: Video },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'users', label: 'users', icon: Users }
                        ].map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as "overview" | "content" | "analytics" | 'users')}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-[#151231] rounded-lg p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Course Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                        <p className="text-white">{course.title}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                        <p className="text-white">{course.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                            <p className="text-white">
                                                {categories.find(cat => course?.category === cat._id)?.categoryName || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                                            <p className="text-white">{course.price}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                                            <p className="text-white">
                                                {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                                            <p className="text-white">
                                                {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#151231] rounded-lg p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Course Image</h3>
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    width={300}
                                    height={200}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            </div>

                            <div className="bg-[#151231] rounded-lg p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleEditClick}
                                        className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                        Edit Course
                                    </button>
                                    <button
                                        onClick={handleTogglePublish}
                                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${course.isPublished
                                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                    >
                                        {course.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                        {course.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Course Content ({course.content.length} lessons)</h2>
                            <div className="text-sm text-gray-400">
                                Total Duration: {formatDuration(calculateTotalDuration())}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {course.content.map((item, index) => (
                                <div key={index} className="bg-[#151231] rounded-lg border border-gray-800">
                                    <div className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                                        onClick={() => setExpandedContent(`${index}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 text-sm font-mono">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <Video className="text-white" size={16} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{item.title}</h3>
                                                    <p className="text-sm text-gray-400">{formatDuration(item.duration)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); setPlayingVideo(`${index}`); }}
                                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedContent === `${index}` && (
                                        <div className="border-t border-gray-800 p-4 bg-gray-900">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-white mb-2">Video Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Duration:</span>
                                                            <span className="text-white">{formatDuration(item.duration)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Order:</span>
                                                            <span className="text-white">{index + 1}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Video URL:</span>
                                                            <span className="text-white truncate max-w-40">{item.videoUrl}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {playingVideo === `${index}` && (
                                                    <div>
                                                        <h4 className="font-medium text-white mb-2">Preview</h4>
                                                        <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                                                            {item.videoUrl ? (
                                                                <video
                                                                    controls
                                                                    className="w-full h-full rounded-lg"
                                                                    src={item.videoUrl}
                                                                >
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : (
                                                                <div className="text-gray-400 text-center">
                                                                    <Video size={32} className="mx-auto mb-2" />
                                                                    <p>No video URL provided</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {course.content.length === 0 && (
                            <div className="text-center py-12">
                                <Video size={48} className="mx-auto text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-300 mb-2">No content added yet</h3>
                                <p className="text-gray-500 mb-4">Add lessons to make your course complete</p>
                                <button onClick={handleEditClick} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                                    Add Content
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#151231] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-300">Total Revenue</h3>
                                <IndianRupee className="text-green-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{0}</p>
                            <p className="text-sm text-green-500 mt-1">+12% from last month</p>
                        </div>

                        <div className="bg-[#151231] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-300">Enrollments</h3>
                                <Users className="text-blue-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{course.purchasedUsers?.length || 0}</p>
                            <p className="text-sm text-blue-500 mt-1">+5 this week</p>
                        </div>

                        <div className="bg-[#151231] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-300">Completion Rate</h3>
                                <Activity className="text-purple-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{0}%</p>
                            <p className="text-sm text-purple-500 mt-1">Above average</p>
                        </div>

                        <div className="bg-[#151231] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-300">Rating</h3>
                                <Star className="text-yellow-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{'0.0'}</p>
                            <p className="text-sm text-yellow-500 mt-1">{0} reviews</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-[#151231] rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Enrolled Users</h2>
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No Users enrolled yet</h3>
                            <p className="text-gray-500">User data will appear here once users enroll in your course</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Modal */}
            {showModal && (
                <CourseModal
                    setShowModal={setShowModal}
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories}
                    editingCourse={course}
                    setEditingCourse={() => { }}
                    fetchData={fetchData}
                />
            )}
        </div>
    );
};

export default AdminCourseDetail;