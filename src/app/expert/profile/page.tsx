'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { ExpertProfile } from '../../../types/expertTypes';
import { getExpertData } from '@/app/service/expert/expertApi';

import { Button } from '../../../components/ui/Button';
import { ProfileField } from '@/components/expert/profile/ProfileField';
import { ProfileInfoCard } from '@/components/expert/profile/ProfileInfoCard';
import { ExperienceBadge, StatusBadge } from '@/components/expert/profile/Badge';

import { User } from 'lucide-react';


export default function ExpertProfilePage() {
    const router = useRouter();
    const [expertData, setExpertData] = useState<ExpertProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExpertData();
    }, []);

    const fetchExpertData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getExpertData()
            if (!response.status) {
                throw new Error('Failed to fetch profile data');
            }
            setExpertData(response.expertDetails);
        } catch (error) {
            console.error('Error fetching expert data:', error);
            setError('Failed to load profile data');
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        router.push('/expert/profile/edit');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#151231] mx-5 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !expertData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#151231] mx-5 rounded-lg">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2">
                        {error || 'Profile Not Found'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Unable to load your profile data.
                    </p>
                    <Button onClick={() => fetchExpertData()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-5 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white">Profile</h1>
                                    <p className="text-white/80 text-lg">Manage your trading expert profile</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="secondary" onClick={() => router.push('/expert/dashboard')} >
                                    Back to Dashboard
                                </Button>
                                <Button onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                {/* Profile Status Alert */}
                {expertData.isVerified === 'Pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Verification Pending
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>Your profile is currently under review. You&apos;ll be notified once the verification is complete.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {expertData.isVerified === 'Declined' && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Verification Declined
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>Your profile verification was declined. Please update your information and resubmit for review.</p>
                                </div>
                                <div className="mt-4">
                                    <Button size="sm" onClick={(() => router.push(`/expert/verification/?email=${expertData.email}`))}>
                                        Resubmit for Verification
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Picture and Basic Info */}
                    <div className="lg:col-span-1">
                        <ProfileInfoCard title="Profile Picture">
                            <div className="text-center">
                                <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                                    {expertData.profilePicture ? (
                                        <Image src={expertData.profilePicture} width={100} height={100} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                                    {expertData.fullName}
                                </h2>
                                <div className="flex justify-center space-x-2 mb-4">
                                    <StatusBadge status={expertData.isVerified || 'Pending'} />
                                    {expertData.experience_level && (<ExperienceBadge level={expertData.experience_level} />)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {expertData.isActive ? 'Active' : 'Inactive'} Expert
                                </p>
                            </div>
                        </ProfileInfoCard>

                        {/* Quick Stats */}
                        <ProfileInfoCard title="Quick Stats">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-300">Years of Experience</span>
                                    <span className="text-sm font-medium text-gray-300">
                                        {expertData.year_of_experience || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-300">Primary Market</span>
                                    <span className="text-sm font-medium text-gray-300">
                                        {expertData.markets_Traded || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-300">Trading Style</span>
                                    <span className="text-sm font-medium text-gray-300">
                                        {expertData.trading_style || 'Not specified'}
                                    </span>
                                </div>
                            </div>
                        </ProfileInfoCard>
                    </div>

                    {/* Detailed Information */}
                    <div className="lg:col-span-2">
                        {/* Personal Information */}
                        <ProfileInfoCard title="Personal Information">
                            <div className="divide-y divide-gray-200">
                                <ProfileField label="Full Name" value={expertData.fullName}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Email Address" value={expertData.email}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Phone Number" value={expertData.phoneNumber}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Date of Birth" value={expertData.DOB ? new Date(expertData.DOB).toLocaleDateString() : undefined}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Location" value={expertData.state && expertData.country ? `${expertData.state}, ${expertData.country}` : expertData.country}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    }
                                />
                            </div>
                        </ProfileInfoCard>

                        {/* Trading Information */}
                        <ProfileInfoCard title="Trading Information">
                            <div className="divide-y divide-gray-200">
                                <ProfileField label="Experience Level" value={expertData.experience_level}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Years of Experience" value={expertData.year_of_experience?.toString()}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Markets Traded" value={expertData.markets_Traded}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    }
                                />
                                <ProfileField label="Trading Style" value={expertData.trading_style}
                                    icon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    }
                                />
                            </div>
                        </ProfileInfoCard>

                        {/* Verification Documents */}
                        <ProfileInfoCard title="Verification Documents">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-400">Proof of Experience</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-md ${expertData.proof_of_experience ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {expertData.proof_of_experience ? 'Uploaded' : 'Not uploaded'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-400">Introduction Video</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${expertData.Introduction_video ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {expertData.Introduction_video ? 'Uploaded' : 'Not uploaded'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-400">Government ID</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${expertData.Government_Id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {expertData.Government_Id ? 'Uploaded' : 'Not uploaded'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-400">Selfie with ID</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${expertData.selfie_Id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {expertData.selfie_Id ? 'Uploaded' : 'Not uploaded'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ProfileInfoCard>
                    </div>
                </div>
            </div>
        </div>
    );
}