'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Eye, Search, BookOpen, Users, Loader2, IndianRupee, GraduationCap, } from 'lucide-react';

import { ICourse, ICategory, ICourseFormData, } from '@/types/courseTypes';
import courseApi from '@/app/service/admin/courseApi';
import CourseModal from '@/components/admin/CourseModal';


const AdminCoursesPage = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const router = useRouter();
    const [formData, setFormData] = useState<ICourseFormData>({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        content: [],
        isPublished: false
    });

    // Fetch courses and categories
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);
            const [coursesRes, categoriesRes] = await Promise.all([courseApi.getCourse(), courseApi.getCategory()]);
            if (!coursesRes.status || !categoriesRes.status) {
                throw new Error('Failed to fetch data');
            }
            setCourses(coursesRes.courses || []);
            setCategories(categoriesRes.categories || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course: ICourse): void => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            category: course.category,
            content: course.content || [],
            isPublished: course.isPublished
        });
        setShowModal(true);
    };

    const handleDelete = async (courseId: string): Promise<void> => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this course?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;
        try {
            const response = await courseApi.deleteCourse(courseId)
            if (!response.status) {
                throw new Error('Failed to delete course');
            }
            setCourses(courses.filter(course => course._id !== courseId));
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || course.category === filterCategory;
        const matchesStatus = !filterStatus || (filterStatus === 'published' && course.isPublished) || (filterStatus === 'draft' && !course.isPublished);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#151231] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-white">Loading courses...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Course Management</h1>
                                    <p className="text-white/80 mt-1 text-md">Manage your courses, content, and publishing status</p>
                                </div>
                            </div>
                            <div className="relative flex items-center gap-1 mr-5">
                                <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <Plus size={20} />
                                    Add New Course
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Filters */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                        <div className="relative z-10">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent placeholder:text-gray-300"
                            />
                        </div>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 relative z-10 border text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        >
                            <option value="" className="text-black">All Categories</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id} className="text-black">
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 relative z-10 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                        >
                            <option value="" className="text-black">All Status</option>
                            <option value="published" className="text-black">Published</option>
                            <option value="draft" className="text-black">Draft</option>
                        </select>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 z-0"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 z-0"></div>
                </div>


                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="flex flex-col justify-between bg-[#151231] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                            <div className="relative h-48 w-full">
                                <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                <div className="absolute top-4 right-4">
                                    <button onClick={() => router.push(`/admin/course/${course._id}`)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition-all duration-200"
                                    >
                                        <Eye size={18} className="opacity-90" />
                                        <span className="text-sm font-medium">View</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {course.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {categories.find((cat) => course?.category === cat._id)?.categoryName}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <IndianRupee size={16} />
                                                <span>{course.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={16} />
                                                <span>{course.purchasedUsers?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={16} />
                                                <span>{course.content?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(course)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(course._id)} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-28">
                        <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-100 mb-2">No courses found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal &&
                <CourseModal setShowModal={setShowModal} formData={formData} setFormData={setFormData} categories={categories} editingCourse={editingCourse} setEditingCourse={setEditingCourse} fetchData={fetchData} />
            }
        </div>
    );
};

export default AdminCoursesPage;