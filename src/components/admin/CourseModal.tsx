"use client";

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Loader2, Upload, Plus, Trash2 } from 'lucide-react';

import courseApi from '@/app/service/admin/courseApi';
import { ICategory, ICourse, ICourseFormData } from '@/types/courseTypes';
import { courseValidation } from '@/app/utils/Validation';
import { notifyNewCourseAvailable } from '@/app/service/shared/notificationAPI';

interface Props {
    setShowModal: (value: boolean) => void;
    formData: ICourseFormData;
    setFormData: React.Dispatch<React.SetStateAction<ICourseFormData>>;
    categories: ICategory[];
    editingCourse: ICourse | null;
    setEditingCourse: (course: ICourse | null) => void;
    fetchData: () => Promise<void>;
}

const CourseModal: React.FC<Props> = ({ setShowModal, formData, categories, editingCourse, setEditingCourse, fetchData, }) => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);

    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors, isSubmitting }, } = useForm<ICourseFormData>({
        defaultValues: formData,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'content',
    });

    const imageUrl = watch('imageUrl');

    useEffect(() => {
        reset(formData);
    }, [formData, reset]);

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            setUploadingImage(true);
            const data = new FormData();
            data.append('file', file);
            data.append('folder', 'Course');
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: data });
                const result = await res.json();
                if (result.success && result.url) {
                    setValue('imageUrl', result.url);
                    toast.success('Image uploaded successfully');
                } else {
                    throw new Error(result.error || 'Upload failed');
                }
            } catch (error) {
                console.log("image error in course", error);
                toast.error('Image upload failed');
            } finally {
                setUploadingImage(false);
            }
        };
        input.click();
    };

    const handleVideoUpload = async (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            if (file.size > 100 * 1024 * 1024) return toast.error("Max size  100MB");
            setUploadingVideo(index);
            try {
                // Request signed URL and get S3 key
                const res = await fetch("/api/signed-url", { method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                        folder: "CourseVideos",
                    }),
                });
                const { uploadUrl, key, error } = await res.json();
                if (error) throw new Error(error);
                // Upload file to S3
                const upload = await fetch(uploadUrl, {  method: "PUT", headers: { "Content-Type": file.type }, body: file,});
                if (!upload.ok) throw new Error("Upload failed");
                // Save the S3 key in form (not full public URL)
                setValue(`content.${index}.videoUrl`, key);
                toast.success("Video uploaded successfully");
            } catch (err) {
                console.error("eroor while upload to s3",err);
                toast.error("Video upload failed");
            } finally {
                setUploadingVideo(null);
            }
        };
        input.click();
    };

    const onSubmit = async (data: ICourseFormData) => {
        if (!data.imageUrl) {
            toast.error('Course image is required');
            return;
        }
        if (!data.content || data.content.length === 0) {
            toast.error('At least one content item is required');
            return;
        }
        const isContentValid = data.content.every(
            (item) => item.title && item.duration > 0 && item.videoUrl
        );
        if (!isContentValid) {
            toast.error('Each content must have title, duration > 0, and video URL');
            return;
        }
        try {
            const cleanedData: ICourseFormData = { ...data, content: data.content.map(({ _id, ...rest }) => (_id ? { _id, ...rest } : rest)), };
            const response = editingCourse ? await courseApi.editCourse(editingCourse._id, cleanedData) : await courseApi.addCourse(cleanedData);
            if (response.status) {
                toast.success(editingCourse ? 'Course updated' : 'Course created');
                if (!editingCourse) {
                    await notifyNewCourseAvailable(response?.course._id, response.course.title)
                }
                await fetchData();
                setShowModal(false);
                setEditingCourse(null);
                reset();
            }
        } catch {
            toast.error('Save failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label>Course Title *</label>
                            <input {...register('title', courseValidation.title)} className="w-full border px-3 py-2 rounded" />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>
                        <div>
                            <label>Price ($) *</label>
                            <input type="number" {...register('price', courseValidation.price)} className="w-full border px-3 py-2 rounded" />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label>Description *</label>
                        <textarea rows={4} {...register('description', courseValidation.description)} className="w-full border px-3 py-2 rounded" />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label>Category *</label>
                            <select {...register('category', courseValidation.category)} className="w-full border px-3 py-2 rounded">
                                <option value="">Select</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.categoryName}</option>)}
                            </select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                        </div>
                        <div>
                            <label>Course Image *</label>
                            <input type="hidden" {...register('imageUrl', courseValidation.imageUrl)} />
                            <button type="button" onClick={handleImageUpload} className="w-full border-dashed border px-3 py-2 rounded flex justify-center items-center">
                                {uploadingImage ? <Loader2 className="animate-spin" /> : <Upload />} Upload Image
                            </button>
                            {!imageUrl && <p className="text-red-500 text-sm">Course image is required</p>}
                        </div>
                    </div>

                    {/* Course Content */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label>Course Content</label>
                            <button type="button" onClick={() => append({ title: '', duration: 0, videoUrl: '' })} className="text-blue-600 flex items-center gap-1"><Plus size={16} /> Add</button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded mb-4">
                                <input {...register(`content.${index}.title`, courseValidation.contentTitle)} className="w-full mb-2 border px-3 py-1 rounded" placeholder="Content title" />
                                {errors.content?.[index]?.title && <p className="text-red-500 text-sm">{errors.content[index]?.title?.message}</p>}

                                <input type="number" {...register(`content.${index}.duration`, courseValidation.contentDuration)} className="w-full mb-2 border px-3 py-1 rounded" placeholder="Duration" />
                                {errors.content?.[index]?.duration && <p className="text-red-500 text-sm">{errors.content[index]?.duration?.message}</p>}

                                <input {...register(`content.${index}.videoUrl`, courseValidation.videoUrl)} className="w-full mb-2 border px-3 py-1 rounded" placeholder="Video URL" />
                                <button type="button" onClick={() => handleVideoUpload(index)} disabled={uploadingVideo === index} className="text-sm text-blue-600 flex items-center gap-1">
                                    {uploadingVideo === index ? <Loader2 className="animate-spin" /> : <Upload size={16} />} Upload Video
                                </button>

                                <button type="button" onClick={() => remove(index)} className="text-sm text-red-600 mt-2 flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" {...register('isPublished')} />
                        <label>Publish this course immediately</label>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
                            {isSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                        </button>
                        <button type="button" onClick={() => { setShowModal(false); setEditingCourse(null); reset(); }} className="px-6 py-3 border rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseModal;
