"use client"

import { User, Edit3, CreditCard, MessageCircle, Bell, Settings, Award, Eye, EyeOff, Phone, Lock, Check, X, LogOut, Camera, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

import QuickStats from '@/components/user/profile/QuickStats';
import AchievementsCard from '@/components/user/profile/AchievementsCard';
import UpgradePlanCard from '@/components/user/profile/UpgradePlanCard';
import OtpVerificationModal from '@/components/user/profile/OtpVerificationModal';
import NotificationSettings from '@/components/user/profile/NotificationSettings';
import ExpertConsultationCard from '@/components/user/profile/ExpertConsultationCard';
import UpcomingConsultationsList from '@/components/user/profile/UpcomingConsultationsList';
import SubscriptionCard from '@/components/user/profile/SubscriptionCard';
import PurchaseHistory from '@/components/user/profile/PurchaseHistory';

import userApi from '@/app/service/user/userApi';
import { UpdateProfilePayload } from '@/types/types';
import { logoutApi } from '@/app/service/shared/sharedApi';
import { useAuthStore } from '@/store/authStore';
import { signOut } from 'next-auth/react';


const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
    const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', newPassword: '', confirmPassword: '', profilePicture: '' });
    const [otpState, setOtpState] = useState({ showOtpModal: false, otpCode: '', isVerifying: false, otpSent: false, countdown: 0 });
    const [passwordValidation, setPasswordValidation] = useState({ minLength: false, hasUppercase: false, hasLowercase: false, hasNumber: false, hasSpecialChar: false, passwordsMatch: false });
    const [pendingUpdate, setPendingUpdate] = useState<UpdateProfilePayload | null>(null);
    const [userData, setUserData] = useState({ id: '', fullName: '', email: '', phoneNumber: '', profilePicture: null, createdAt: '' });
    const [subscription, setSubscription] = useState<{ type: string; status: string; callsRemaining: number; totalSlots: number; endDate: string; } | null>(null);

    // New states for enhanced upload
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const router = useRouter();
    const authStore = useAuthStore();

    const getProfileData = async () => {
        const userData = await userApi.getUserProfile();
        if (userData.status) {
            const transformedData = {
                id: userData.userDetails.id,
                fullName: userData.userDetails.fullName,
                email: userData.userDetails.email,
                phoneNumber: userData.userDetails.phoneNumber,
                profilePicture: userData.userDetails.profilePicture || "/images/profilePicture.jpg",
                createdAt: userData.userDetails.createdAt
            };
            setUserData(transformedData);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await userApi.checkSubscription();
            if (response.status && response.subscription) {
                const { subscriptionPlan, paymentStatus, endDate, callsRemaining } = response.subscription;
                const isExpired = new Date() > new Date(endDate);
                setSubscription({
                    type: subscriptionPlan.name || 'free', status: !isExpired && paymentStatus === 'paid' ? 'active' : 'expired',
                    callsRemaining: callsRemaining, totalSlots: subscriptionPlan.accessLevel.expertCallsPerMonth, endDate: endDate || ''
                });
            } else {
                setSubscription({ type: 'free', status: 'inactive', callsRemaining: 0, totalSlots: 0, endDate: '' });
            }
        } catch (err) {
            console.error('Error fetching subscription:', err);
        }
    };

    useEffect(() => {
        getProfileData();
        fetchSubscription();
    }, [])

    const startEditing = () => {
        setEditForm({
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            newPassword: '',
            confirmPassword: '',
            profilePicture: ''
        });
        setImagePreview(null);
        setIsEditing(true);
        setActiveTab('settings')
    };

    const validatePassword = (password: string, confirmPassword: string) => {
        const validation = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            passwordsMatch: password === confirmPassword && password.length > 0
        };
        setPasswordValidation(validation);
        return Object.values(validation).every(Boolean);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        if (field === 'newPassword' || field === 'confirmPassword') {
            const newPassword = field === 'newPassword' ? value : editForm.newPassword;
            const confirmPassword = field === 'confirmPassword' ? value : editForm.confirmPassword;
            validatePassword(newPassword, confirmPassword);
        }
    };

    const handleOtp = async () => {
        setOtpState(prev => ({ ...prev, isVerifying: true }));
        const response = await userApi.verifyOtp(+(otpState.otpCode), userData.email)
        if (response.status) {
            if (pendingUpdate) {
                const response = await userApi.updateProfile(pendingUpdate);
                if (response?.status) {
                    toast.success("Profile updated successfully!");
                    setIsEditing(false);
                    getProfileData();
                    setPendingUpdate(null);
                    setImagePreview(null);
                } else {
                    toast.error(response?.message || "Failed to update profile.");
                }
            }
            setOtpState({ showOtpModal: false, otpCode: '', isVerifying: false, otpSent: false, countdown: 0 });
        } else {
            toast.error('Invalid OTP. Please try again.');
            setOtpState(prev => ({ ...prev, isVerifying: false }));
        }
    };

    const handleSaveProfile = async () => {
        const hasPhoneChanged = editForm.phoneNumber !== userData.phoneNumber;
        const hasPasswordChanged = editForm.newPassword.length > 0;
        if (hasPasswordChanged) {
            const isPasswordValid = validatePassword(editForm.newPassword, editForm.confirmPassword);
            if (!isPasswordValid) {
                toast.error('Please ensure password meets all requirements and passwords match.');
                return;
            }
        }
        const updatedPayload = {
            id: userData.id,
            fullName: editForm.fullName,
            phoneNumber: editForm.phoneNumber,
            newPassword: editForm.newPassword,
            profilePicture: editForm.profilePicture
        };
        if (hasPasswordChanged) {
            updatedPayload.newPassword = editForm.newPassword;
        }
        if (hasPhoneChanged || hasPasswordChanged) {
            setPendingUpdate(updatedPayload);
            setOtpState(prev => ({
                ...prev,
                showOtpModal: true,
                otpCode: '',
                otpSent: false,
                countdown: 0
            }));
            await userApi.resendOtp(userData.email)
            setOtpState(prev => ({ ...prev, otpSent: true, countdown: 60 }));
            const timer = setInterval(() => {
                setOtpState(prev => {
                    if (prev.countdown <= 1) {
                        clearInterval(timer);
                        return { ...prev, countdown: 0 };
                    }
                    return { ...prev, countdown: prev.countdown - 1 };
                });
            }, 1000);
        } else {
            const response = await userApi.updateProfile(updatedPayload);
            if (response?.status) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                getProfileData();
                setImagePreview(null);
            } else {
                toast.error(response?.message || "Failed to update profile.");
            }
        }
    };

    const handleResendOTP = async () => {
        try {
            await userApi.resendOtp(userData.email)
            setOtpState(prev => ({ ...prev, otpSent: true, countdown: 60 }));
            const timer = setInterval(() => {
                setOtpState(prev => {
                    if (prev.countdown <= 1) {
                        clearInterval(timer);
                        return { ...prev, countdown: 0 };
                    }
                    return { ...prev, countdown: prev.countdown - 1 };
                });
            }, 1000);
        } catch (error) {
            console.error("error while resend otp", error)
            toast.error("Failed to resend OTP.");
        }
    }

    const getSubscriptionBadge = () => {
        switch (subscription?.type) {
            case 'Starter':
                return 'bg-purple-700 text-white';
            case 'Pro Trader':
                return 'bg-slate-600 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    const handleLogout = async () => {
        const response = await logoutApi("user");
        if (response?.status) {
            await signOut({ callbackUrl: '/login' });
            authStore.logout()
            router.replace('/login');
        }
    };

    // Enhanced file upload handler
    const handleFileUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/jpg,image/png,image/webp';

        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload file
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'profile-pictures');

            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.success && data.url) {
                    setEditForm(prev => ({ ...prev, profilePicture: data.url }));
                    toast.success('Image uploaded successfully!');
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                toast.error('Failed to upload image. Please try again.');
                setImagePreview(null);
            } finally {
                setIsUploading(false);
            }
        };
        input.click();
    };

    // Remove uploaded image
    const handleRemoveImage = () => {
        setImagePreview(null);
        setEditForm(prev => ({ ...prev, profilePicture: '' }));
        toast.info('Image removed. Click Save Changes to update your profile.');
    };

    return (
        <div className="min-h-screen flex gap-6 p-8">
            <div className="w-full">
                {/* Profile Header */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative group">
                            <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center ring-4 ring-purple-500/20 overflow-hidden">
                                {imagePreview || (editForm.profilePicture && isEditing) ? (
                                    <Image src={imagePreview || editForm.profilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : userData.profilePicture ? (
                                    <Image src={userData.profilePicture} alt="Profile" fill className="object-cover rounded-2xl" />
                                ) : (
                                    <User className="w-14 h-14 text-white" />
                                )}

                                {/* Upload Loading Overlay */}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                                    </div>
                                )}
                            </div>

                            {/* Edit Controls */}
                            {isEditing && (
                                <div className="absolute -bottom-2 -right-2 flex gap-2">
                                    <button className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleFileUpload}  disabled={isUploading} title="Upload new photo"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>

                                    {(imagePreview || editForm.profilePicture) && (
                                        <button className="bg-red-500 hover:bg-red-400 text-white p-3 rounded-xl transition-all duration-200 shadow-lg"
                                            onClick={handleRemoveImage} title="Remove photo"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                {isEditing ? (
                                    <div className="space-y-4 w-full">
                                        <label className="text-slate-300 font-medium">Email Address</label>
                                        <input type="email" value={userData.email} disabled readOnly className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed" />
                                        <p className="text-slate-500 text-xs">Email cannot be changed</p>

                                        {/* Image Upload Instructions */}
                                        {isEditing && (
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                                                <p className="text-blue-300 text-sm flex items-start gap-2">
                                                    <Camera className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        Click the camera icon to upload a new profile picture.
                                                        <span className="block text-blue-400 text-xs mt-1">
                                                            Supported: JPG, PNG, WebP • Max size: 5MB
                                                        </span>
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                            {userData.fullName}
                                        </h1>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${getSubscriptionBadge()}`}>
                                            <span className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                {subscription?.type} Plan
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                            {!isEditing && (
                                <p className="text-slate-300 mb-2 text-lg">{userData.email}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={handleSaveProfile}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isUploading}
                                    >
                                        Save Changes
                                    </button>
                                    <button onClick={() => {
                                        setIsEditing(false);
                                        setImagePreview(null);
                                    }}
                                        className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className='space-y-2'>
                                    <button onClick={startEditing} className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium">
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button onClick={handleLogout} className="px-9 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* OTP Verification Modal */}
                {otpState.showOtpModal && (
                    <OtpVerificationModal otpState={otpState} setOtpState={setOtpState} handleOtp={handleOtp} handleResendOTP={handleResendOTP} />
                )}

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-1 bg-slate-800/30 backdrop-blur-sm p-2 rounded-2xl border border-slate-700/50">
                        {[
                            { id: 'overview', label: 'Overview', icon: User },
                            { id: 'purchases', label: 'Purchase History', icon: CreditCard },
                            { id: 'consultations', label: 'Expert Consultations', icon: MessageCircle },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setActiveTab(id)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${activeTab === id
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="w-full">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8 w-full">
                        {activeTab === 'overview' && (
                            <div className="space-y-8 w-full">
                                <SubscriptionCard />
                                {subscription?.status == "active" && (
                                    <ExpertConsultationCard subscription={subscription} />
                                )}
                            </div>
                        )}

                        {activeTab === 'purchases' && (
                            <PurchaseHistory />
                        )}

                        {activeTab === 'consultations' && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    Expert Consultations
                                </h3>
                                <UpcomingConsultationsList />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-8">
                                {isEditing && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            Profile Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium flex items-center gap-2 ">Full name</label>
                                                <input type="text" value={editForm.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Full Name"
                                                    className=" w-full   text-white bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Phone Number
                                                </label>
                                                <input type="tel" value={editForm.phoneNumber || ""} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="Enter phone number"
                                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                                {editForm.phoneNumber !== userData.phoneNumber && editForm.phoneNumber && (
                                                    <p className="text-amber-400 text-sm flex items-center gap-1">
                                                        <Bell className="w-3 h-3" />
                                                        OTP verification required
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg"> <Lock className="w-5 h-5 text-white" /></div>
                                            Change Password
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium">New Password</label>
                                                <div className="relative">
                                                    <input type={showPassword.new ? "text" : "password"} value={editForm.newPassword} onChange={(e) => handleInputChange('newPassword', e.target.value)} placeholder="Enter new password"
                                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium">Confirm Password</label>
                                                <div className="relative">
                                                    <input type={showPassword.confirm ? "text" : "password"} value={editForm.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="Confirm new password"
                                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {(editForm.newPassword || editForm.confirmPassword) && (
                                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                                                    <h4 className="text-slate-300 font-medium mb-3">Password Requirements:</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                        <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.hasLowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            One lowercase letter
                                                        </div>
                                                        <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            One number
                                                        </div>
                                                        <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.hasSpecialChar ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            One special character
                                                        </div>
                                                        <div className={`flex items-center gap-2 ${passwordValidation.passwordsMatch ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.passwordsMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            Passwords match
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {editForm.newPassword && (
                                                <p className="text-amber-400 text-sm flex items-center gap-1">
                                                    <Bell className="w-3 h-3" />
                                                    OTP verification required for password change
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!isEditing && <NotificationSettings />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <QuickStats userData={userData} subscriptionData={subscription} />
                <UpgradePlanCard />
                <AchievementsCard />
            </div>
        </div>
    );
};

export default UserProfile;