"use client";

import Image from 'next/image';
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { X, Loader2, Upload, Plus, Trash2, Video, Check, Save } from 'lucide-react';

import { addCourse, editCourse } from '@/app/service/admin/courseApi';
import { ICategory, ICourse, ICourseContent, ICourseFormData } from '@/types/courseTypes';


interface Props {
    setShowModal: (value: boolean) => void;
    formData: ICourseFormData;
    setFormData: React.Dispatch<React.SetStateAction<ICourseFormData>>;
    categories: ICategory[];
    editingCourse: ICourse | null;
    setEditingCourse: (course: ICourse | null) => void;
    fetchData: () => Promise<void>;
}

const CourseModal: React.FC<Props> = ({ setShowModal, formData, setFormData, categories, editingCourse, setEditingCourse, fetchData }) => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);

    const addContentItem = (): void => {
        setFormData({ ...formData, content: [...formData.content, { title: '', videoUrl: '', duration: 0 }] });
    };

    const updateContentItem = (index: number, field: keyof ICourseContent, value: string | number): void => {
        const updatedContent = formData.content.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setFormData({ ...formData, content: updatedContent });
    };

    const removeContentItem = (index: number): void => {
        setFormData({ ...formData, content: formData.content.filter((_, i) => i !== index) });
    };

    const resetForm = (): void => {
        setFormData({ title: '', description: '', price: 0, imageUrl: '', category: '', content: [], isPublished: false });
    };

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'Course');
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData, });
                const data = await res.json();
                if (data.success && data.url) {
                    setFormData(prev => ({ ...prev, imageUrl: data.url }));
                    toast.success('File uploaded successfully!');
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                toast.error('File upload failed');
            } finally {
                setUploadingImage(false);
            }
        };
        input.click();
    };

    const handleVideoUpload = async (contentIndex: number) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            // Validate file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
                toast.error('Video size should be less than 100MB');
                return;
            }
            setUploadingVideo(contentIndex);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'CourseVideos');
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success && data.url) {
                    updateContentItem(contentIndex, 'videoUrl', data.url);
                    toast.success('Video uploaded successfully!');
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                toast.error('Video upload failed');
            } finally {
                setUploadingVideo(null);
            }
        };
        input.click();
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
                toast.success(editingCourse ? 'Course updated successfully' : 'Course created successfully');
                await fetchData();
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingCourse ? 'Edit Course' : 'Create New Course'}
                        </h2>
                        <button onClick={() => { setShowModal(false); setEditingCourse(null); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Title & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Title *
                            </label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter course title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter course description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category & Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                            <div className="space-y-3">
                                <button type="button" onClick={handleImageUpload} disabled={uploadingImage}
                                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600"
                                >
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="text-sm">Uploading...</span>
                                        </>
                                    ) : (
                                        <div className='flex items-center space-x-3.5'>
                                            <Upload className="w-6 h-6" />
                                            <div className="text-center">
                                                <span className="text-sm font-medium">Click to upload image</span>
                                                <div className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</div>
                                            </div>
                                        </div>
                                    )}
                                </button>
                                {formData.imageUrl && (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                        <Image src={formData.imageUrl} alt="Course preview" width={200} height={120} className="w-full h-24 object-cover" />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                            <Check size={12} />
                                        </div>
                                        <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">Course Content</label>
                            <button type="button" onClick={addContentItem}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus size={16} /> Add Content
                            </button>
                        </div>
                        {formData.content.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        <Video size={16} /> Content Item {index + 1}
                                    </h4>
                                    <button type="button" onClick={() => removeContentItem(index)} className="text-red-600 hover:text-red-700">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className='flex space-x-3'>
                                        <div className='w-[90%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                                            <input type="text" value={item.title} onChange={(e) => updateContentItem(index, 'title', e.target.value)} placeholder="Enter content title"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                            <input type="number" value={item.duration} onChange={(e) => updateContentItem(index, 'duration', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter duration"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Content</label>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <input type="url" value={item.videoUrl} onChange={(e) => updateContentItem(index, 'videoUrl', e.target.value)} placeholder="Enter video URL or upload"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button type="button" onClick={() => handleVideoUpload(index)} disabled={uploadingVideo === index}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2 transition-colors"
                                                >
                                                    {uploadingVideo === index ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Upload size={16} />
                                                    )}
                                                    {uploadingVideo === index ? 'Uploading...' : 'Upload'}
                                                </button>
                                            </div>
                                            {item.videoUrl && (
                                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                                                    <Check size={16} />
                                                    <span>Video URL added</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Publish Checkbox */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish this course immediately</label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={handleSubmit} disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            {submitting ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            {submitting ? (editingCourse ? 'Updating...' : 'Creating...') : (editingCourse ? 'Update Course' : 'Create Course')}
                        </button>
                        <button type="button" onClick={() => { setShowModal(false); setEditingCourse(null); resetForm(); }} disabled={submitting}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;