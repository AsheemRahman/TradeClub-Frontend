import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../ui/Button';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageChange: (url: string | null) => void;
    error?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImage, onImageChange, error }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // ✅ Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'profile-pictures');

        try {
            setUploading(true);
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Upload failed');
            }

            setPreview(data.url);
            onImageChange(data.url); // Send S3 URL back to parent
            toast.success('Image uploaded successfully!');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
            </label>

            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
                        {preview ? (
                            <Image src={preview} alt="Profile preview" fill className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {preview && (
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Choose Image'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF up to 5MB
                    </p>
                </div>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
