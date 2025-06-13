'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Save, X, DollarSign, BookOpen, Users, Loader2 } from 'lucide-react';
import { ICourse, ICategory, ICourseFormData, ICourseContent } from '@/types/courseTypes';
import { toast } from 'react-toastify';
import { addCourse, editCourse, getCategory, getCourse } from '@/app/service/admin/courseApi';


const AdminCoursesPage = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

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
            const [coursesRes, categoriesRes] = await Promise.all([
                getCourse(),
                getCategory()
            ]);

            if (!coursesRes.ok || !categoriesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const coursesData = await coursesRes.json();
            const categoriesData = await categoriesRes.json();

            setCourses(coursesData.courses || []);
            setCategories(categoriesData.categories || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');

            // Fallback mock data for development
            const mockCategories: ICategory[] = [
                { _id: '1', name: 'Web Development' },
                { _id: '2', name: 'Mobile Development' },
                { _id: '3', name: 'Data Science' },
                { _id: '4', name: 'Design' },
            ];

            const mockCourses: ICourse[] = [
                {
                    _id: '1',
                    title: 'Complete React Mastery',
                    description: 'Learn React from basics to advanced concepts with hands-on projects',
                    price: 99.99,
                    imageUrl: '/images/react-course.jpg',
                    category: { _id: '1', name: 'Web Development' },
                    content: [
                        { title: 'Introduction to React', videoUrl: '/videos/react-intro.mp4', duration: 30 },
                        { title: 'Components and Props', videoUrl: '/videos/react-components.mp4', duration: 45 },
                        { title: 'State Management', videoUrl: '/videos/react-state.mp4', duration: 60 }
                    ],
                    isPublished: true,
                    purchasedUsers: 245,
                    createdAt: '2024-01-15T10:30:00Z'
                },
            ];

            setCategories(mockCategories);
            setCourses(mockCourses);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (): void => {
        setFormData({
            title: '',
            description: '',
            price: 0,
            imageUrl: '',
            category: '',
            content: [],
            isPublished: false
        });
    };

    const handleEdit = (course: ICourse): void => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            category: course.category._id,
            content: course.content || [],
            isPublished: course.isPublished
        });
        setShowModal(true);
    };

    const handleDelete = async (courseId: string): Promise<void> => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/courses/${courseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            setCourses(courses.filter(course => course._id !== courseId));
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const selectedCategory = categories.find(cat => cat._id === formData.category);
            if (!selectedCategory) {
                toast.error('Please select a valid category');
                return;
            }

            const courseData = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                imageUrl: formData.imageUrl,
                category: formData.category,
                content: formData.content,
                isPublished: formData.isPublished
            };

            const response = editingCourse ? await editCourse(editingCourse._id, courseData) : await addCourse(courseData);
            if (response.status) {
                if (editingCourse) {
                    setCourses(courses.map(course =>
                        course._id === editingCourse._id
                            ? { ...response.course, category: selectedCategory }
                            : course
                    ));
                    toast.success('Course updated successfully');
                } else {
                    setCourses([...courses, { ...response.course, category: selectedCategory }]);
                    toast.success('Course created successfully');
                }
            }
            setShowModal(false);
            setEditingCourse(null);
            resetForm();
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error(`Failed to ${editingCourse ? 'update' : 'create'} course`);
        } finally {
            setSubmitting(false);
        }
    };

    const addContentItem = (): void => {
        setFormData({
            ...formData,
            content: [...formData.content, { title: '', videoUrl: '', duration: 0 }]
        });
    };

    const updateContentItem = (index: number, field: keyof ICourseContent, value: string | number): void => {
        const updatedContent = formData.content.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setFormData({ ...formData, content: updatedContent });
    };

    const removeContentItem = (index: number): void => {
        setFormData({
            ...formData,
            content: formData.content.filter((_, i) => i !== index)
        });
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || course.category._id === filterCategory;
        const matchesStatus = !filterStatus ||
            (filterStatus === 'published' && course.isPublished) ||
            (filterStatus === 'draft' && !course.isPublished);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const togglePublishStatus = async (courseId: string): Promise<void> => {
        try {
            const course = courses.find(c => c._id === courseId);
            if (!course) return;

            const response = await fetch(`/api/admin/courses/${courseId}/toggle-publish`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPublished: !course.isPublished }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle publish status');
            }

            setCourses(courses.map(c =>
                c._id === courseId
                    ? { ...c, isPublished: !c.isPublished }
                    : c
            ));

            toast.success(`Course ${!course.isPublished ? 'published' : 'unpublished'} successfully`);
        } catch (error) {
            console.error('Error toggling publish status:', error);
            toast.error('Failed to update publish status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-gray-600">Loading courses...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Course Management - Admin Dashboard</title>
                <meta name="description" content="Manage courses, content, and publishing status" />
            </Head>

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Course Management</h1>
                                <p className="text-gray-600 mt-1">Manage your courses, content, and publishing status</p>
                            </div>
                            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                                <Plus size={20} />
                                Add New Course
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-2 border text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" className='text-black'>All Categories</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id} className='text-black'>{category.name}</option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" className='text-black'>All Status</option>
                                <option value="published" className='text-black'>Published</option>
                                <option value="draft" className='text-black'>Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course._id} className="bg-[#151231] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48">
                                    <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => togglePublishStatus(course._id)}
                                            className={`p-2 rounded-full ${course.isPublished ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                                        >
                                            {course.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.isPublished
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {course.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {course.category.name}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={16} />
                                                <span>${course.price}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={16} />
                                                <span>{course.purchasedUsers || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen size={16} />
                                                <span>{course.content?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingCourse ? 'Edit Course' : 'Create New Course'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingCourse(null);
                                            resetForm();
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter course title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter course description"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Image URL *
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Course Content
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addContentItem}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <Plus size={16} />
                                            Add Content
                                        </button>
                                    </div>

                                    {formData.content.map((item, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-medium text-gray-900">Content Item {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeContentItem(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateContentItem(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Content title"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Video URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={item.videoUrl}
                                                        onChange={(e) => updateContentItem(index, 'videoUrl', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="https://example.com/video.mp4"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Duration (minutes)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.duration}
                                                        onChange={(e) => updateContentItem(index, 'duration', parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                                        Publish this course immediately
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {submitting ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        {submitting
                                            ? (editingCourse ? 'Updating...' : 'Creating...')
                                            : (editingCourse ? 'Update Course' : 'Create Course')
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingCourse(null);
                                            resetForm();
                                        }}
                                        disabled={submitting}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminCoursesPage;