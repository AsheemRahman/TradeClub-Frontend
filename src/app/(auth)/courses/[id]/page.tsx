'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Lock, Clock, BookOpen, Calendar, Star, Users, Award, CheckCircle, ArrowRight, Share2, Globe, PlayCircle, Timer, Target, Zap, ShieldCheck, Tags } from 'lucide-react';
import { ICourse, ICategory } from '@/types/courseTypes';
import { useAuthStore } from '@/store/authStore';
import { handlePurchase } from '@/app/service/user/userApi';
import { toast } from 'react-toastify';
import { categoryData, checkEnrolled, getCourseById } from '@/app/service/user/userApi';

const CourseDetailsPage = () => {
    const params = useParams() as { id?: string };
    const [course, setCourse] = useState<ICourse | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
    const [showAllContent, setShowAllContent] = useState(false);

    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!params?.id) return;
            try {
                setLoading(true);
                const courseRes = await getCourseById(params.id);
                const categoriesRes = await categoryData();
                if (user) {
                    const enrollmentRes = await checkEnrolled(params.id);
                    if (enrollmentRes.status) {
                        setIsEnrolled(enrollmentRes.isEnrolled);
                    } else {
                        setIsEnrolled(false);
                    }
                }
                setCourse(courseRes.course);
                setCategories(categoriesRes.categories);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchCourseDetails();
    }, [params.id, user]);

    const handleBuy = () => {
        if (!course) {
            toast.error("Course not found");
            return;
        }
        if (user) {
            handlePurchase(course)
        } else {
            router.push('/login')
            toast.error("Login to buy course")
        }
    }

    const getTotalLessons = () => course?.content?.length || 0;

    const getTotalDuration = () => {
        const total = course?.content?.reduce((sum, c) => sum + c.duration, 0) || 0;
        return Math.round((total / 60) * 10) / 10;
    };

    const formatDuration = (min: number) => `${Math.floor(min / 60)}h ${min % 60}m`;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mx-5 rounded-lg bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center mx-5 rounded-lg bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
                    <p className="text-gray-400">The course you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden mx-5 rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                                <Zap className="w-4 h-4 mr-2" />
                                Featured Course
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed">
                                {course.description}
                            </p>

                            {/* Course Stats */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center text-gray-300">
                                    <Tags className="w-4 h-4 mr-2 text-purple-400" />
                                    {categories.find(cat => course?.category === cat._id)?.categoryName || 'Unknown'}
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                                    {getTotalLessons()} Lessons
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                                    {getTotalDuration()} Hours
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                    {course.updatedAt && (<>Updated {new Date(course.updatedAt).toLocaleDateString()}</>)}
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Users className="w-4 h-4 mr-2 text-purple-400" />
                                    {course.purchasedUsers?.length || 0} Customer
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="ml-2 text-white font-semibold">4.9</span>
                                    <span className="text-gray-400 ml-3">(2,847 reviews)</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => { if (isEnrolled) { router.push(`/my-learning/${course._id}`); } else { handleBuy(); } }}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>


                                <button className="px-6 py-4 border-2 border-purple-500/50 text-gray-300 rounded-xl hover:bg-purple-500/10 transition-all duration-300 flex items-center">
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Course Preview */}
                        <div className="relative">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-purple-500/20">
                                    <div className="aspect-video relative">
                                        <Image src={course.imageUrl} alt="Course preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                                                <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-3xl font-bold text-white">
                                                ₹{course.price}
                                            </span>
                                            <div className="flex items-center text-green-400">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                <span className="text-sm">Lifetime Access</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center text-gray-300">
                                                <Globe className="w-4 h-4 mr-3 text-purple-400" />
                                                Access on mobile and desktop
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <Award className="w-4 h-4 mr-3 text-purple-400" />
                                                Certificate of completion
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tab Navigation */}
                        <div className="flex gap-1 mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1">
                            {[
                                { id: 'overview', label: 'Overview', icon: Target },
                                { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                                { id: 'reviews', label: 'Reviews', icon: Star }
                            ].map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id as "overview" | "curriculum" | "reviews")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300
                                        ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-6">About This Course</h2>
                                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                            {course.description}
                                        </p>
                                        <p className="text-gray-300 leading-relaxed">
                                            This comprehensive course will take you from a beginner to a confident trader. You&apos;ll learn proven strategies, tools, and real-world techniques used by professional traders and top financial experts through TradeClub.
                                        </p>
                                    </div>

                                    {course.content.length > 0 && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-4">What You&apos;ll Learn</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {course.content.map((item, index) => (
                                                    <div key={index} className="flex items-center text-gray-300">
                                                        <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                                                        {item.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-6">Course Content</h2>
                                    <div className="space-y-3">
                                        {course.content.slice(0, showAllContent ? undefined : 5).map((item, index) => (
                                            <div key={index}
                                                className="group bg-gray-800/50 hover:bg-gray-700/50 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                            <span className="text-purple-300 font-semibold text-sm">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                                                                {item.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                                <div className="flex items-center">
                                                                    <Timer className="w-4 h-4 mr-1" />
                                                                    {formatDuration(item.duration)}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <PlayCircle className="w-4 h-4 mr-1" />
                                                                    Video
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isEnrolled ? (
                                                            <Play className="w-5 h-5 text-purple-400" onClick={() => router.push(`/my-learning/${course._id}`)} />
                                                        ) : (
                                                            <Lock className="w-5 h-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {course.content.length > 5 && (
                                        <button onClick={() => setShowAllContent(!showAllContent)}
                                            className="mt-6 px-6 py-3 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-all duration-300 border border-purple-500/30"
                                        >
                                            {showAllContent ? 'Show Less' : `Show ${course.content.length - 5} More Lessons`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-6">Customer Reviews</h2>
                                    <div className="text-center py-12">
                                        <Star className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">Reviews Coming Soon</h3>
                                        <p className="text-gray-400">Customer reviews will be available shortly.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Features */}
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                            <h3 className="text-xl font-bold text-white mb-4">Course Features</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: ShieldCheck, text: 'Lifetime access', color: 'text-green-400' },
                                    { icon: Globe, text: 'Mobile & desktop access', color: 'text-purple-400' },
                                    { icon: Award, text: 'Certificate of completion', color: 'text-yellow-400' }
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-300">
                                        <feature.icon className={`w-5 h-5 mr-3 ${feature.color}`} />
                                        {feature.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;