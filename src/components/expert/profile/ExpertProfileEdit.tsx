import React, { useState } from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { ProfileImageUpload } from './ProfileImageUpload';
import { ExpertProfile, ExpertProfileFormData } from '../../../types/expertTypes';

interface ExpertProfileEditProps {
    expertData: ExpertProfile;
    onSave: (data: ExpertProfileFormData) => Promise<void>;
    loading?: boolean;
}

export const ExpertProfileEdit: React.FC<ExpertProfileEditProps> = ({ expertData, onSave, loading = false }) => {
    const [formData, setFormData] = useState<ExpertProfileFormData>({
        id: expertData._id || '',
        fullName: expertData.fullName || '',
        phoneNumber: expertData.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        markets_Traded: expertData.markets_Traded || '',
        trading_style: expertData.trading_style || '',
        profilePicture: expertData.profilePicture || '',
    });

    const [errors, setErrors] = useState<Partial<ExpertProfileFormData>>({});
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const marketOptions = [
        { value: 'Stock', label: 'Stock' },
        { value: 'Forex', label: 'Forex' },
        { value: 'Crypto', label: 'Crypto' },
        { value: 'Commodities', label: 'Commodities' }
    ];

    const tradingStyleOptions = [
        { value: 'Scalping', label: 'Scalping' },
        { value: 'Day Trading', label: 'Day Trading' },
        { value: 'Swing Trading', label: 'Swing Trading' },
        { value: 'Position Trading', label: 'Position Trading' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ExpertProfileFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageChange = (file: File | null) => {
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            profilePicture: file.name
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ExpertProfileFormData> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (showPasswordFields) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required';
            }

            if (!formData.newPassword) {
                newErrors.newPassword = 'New password is required';
            } else if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }

            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    return (
        <div className="mx-auto p-6 bg-[#151231] rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <ProfileImageUpload currentImage={expertData.profilePicture} onImageChange={handleImageChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} required />
                    <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} placeholder="+1 (555) 123-4567" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Markets Traded" name="markets_Traded" value={formData.markets_Traded} onChange={handleInputChange} options={marketOptions} error={errors.markets_Traded} />
                    <Select label="Trading Style" name="trading_style" value={formData.trading_style} onChange={handleInputChange} options={tradingStyleOptions} error={errors.trading_style} />
                </div>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-100">Password</h3>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setShowPasswordFields(!showPasswordFields)} >
                            {showPasswordFields ? 'Cancel' : 'Change Password'}
                        </Button>
                    </div>

                    {showPasswordFields && (
                        <div className="space-y-4">
                            <Input label="Current Password" name="currentPassword" type="password" value={formData.currentPassword}
                                onChange={handleInputChange} error={errors.currentPassword} required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="New Password" name="newPassword" type="password" value={formData.newPassword}
                                    onChange={handleInputChange} error={errors.newPassword} required
                                />
                                <Input label="Confirm New Password" name="confirmPassword" type="password" value={formData.confirmPassword}
                                    onChange={handleInputChange} error={errors.confirmPassword} required
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} disabled={loading}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};