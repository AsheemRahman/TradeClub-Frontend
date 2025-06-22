"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ExpertProfileEdit } from '@/components/expert/profile/ExpertProfileEdit';
import { ExpertProfile, ExpertProfileFormData } from '@/types/expertTypes';
import { getExpertData, updateProfile } from '@/app/service/expert/expertApi';
import { useRouter } from 'next/navigation';

export default function ExpertProfileEditPage() {
    const router = useRouter();
    const [expertData, setExpertData] = useState<ExpertProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchExpertData();
    }, []);

    const fetchExpertData = async () => {
        try {
            const response = await getExpertData()
            if (!response.status) {
                throw new Error('Failed to fetch profile data');
            }
            setExpertData(response.expertDetails);
        } catch (error) {
            console.error('Error fetching expert data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData: ExpertProfileFormData) => {
        setSaving(true);
        try {
            const response = await updateProfile(formData);
            if (!response.status) {
                throw new Error(response.message || "Failed to update profile");
            }
            setExpertData(response.expert);
            toast.success("Profile updated successfully!");
            router.push("/expert/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!expertData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600">Unable to load your profile data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mx-5">
            <ExpertProfileEdit expertData={expertData} onSave={handleSave} loading={saving} />
        </div>
    );
}