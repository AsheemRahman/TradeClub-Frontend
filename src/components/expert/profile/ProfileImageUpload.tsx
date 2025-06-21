import Image from 'next/image';
import React, { useState, useRef } from 'react';

import { Button } from '../../ui/Button';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageChange: (file: File | null) => void;
    error?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImage, onImageChange, error }) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange(file);
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
                        <button type="button" onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
                    <Button type="button" variant="secondary"onClick={() => fileInputRef.current?.click()}>
                        Choose Image
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