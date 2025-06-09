"use client"

import { User, Edit3, CreditCard, MessageCircle, Bell, Settings, Award, Eye, EyeOff, Phone, Lock, Check, X, LogOut } from 'lucide-react';
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

import { getUserProfile, resendOtp, updateProfile, verifyOtp } from '@/app/service/user/userApi';
import { purchaseHistory, subscription } from '@/lib/mockData'
import { UpdateProfilePayload } from '@/types/types';
import { logoutApi } from '@/app/service/shared/sharedApi';
import { useAuthStore } from '@/store/authStore';



const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState({ new: false, confirm: false });
    const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', newPassword: '', confirmPassword: '' });
    const [otpState, setOtpState] = useState({ showOtpModal: false, otpCode: '', isVerifying: false, otpSent: false, countdown: 0 });
    const [passwordValidation, setPasswordValidation] = useState({ minLength: false, hasUppercase: false, hasLowercase: false, hasNumber: false, hasSpecialChar: false, passwordsMatch: false });
    const [pendingUpdate, setPendingUpdate] = useState<UpdateProfilePayload | null>(null);
    const [userData, setUserData] = useState({ id: '', fullName: '', email: '', phoneNumber: '', profilePicture: null, });

    const router = useRouter();
    const authStore = useAuthStore();

    const getProfileData = async () => {
        const userData = await getUserProfile();
        if (userData.status) {
            const transformedData = {
                id: userData.userDetails._id,
                fullName: userData.userDetails.fullName,
                email: userData.userDetails.email,
                phoneNumber: userData.userDetails.phoneNumber,
                profilePicture: userData.userDetails.profilePicture || "/images/profilePicture.jpg",
            };
            setUserData(transformedData);
        }
    };

    useEffect(() => {
        getProfileData();
    }, [])

    const startEditing = () => {
        setEditForm({
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber,
            newPassword: '',
            confirmPassword: ''
        });
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
        const response = await verifyOtp(+(otpState.otpCode), userData.email)
        if (response.status) {
            if (pendingUpdate) {
                const response = await updateProfile(pendingUpdate);
                if (response?.status) {
                    toast.success("Profile updated successfully!");
                    setIsEditing(false);
                    getProfileData();
                    setPendingUpdate(null);
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

    // Handle profile save - prepare data and show OTP if needed
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
        // Prepare the update payload
        const updatedPayload = {
            id: userData.id,
            fullName: editForm.fullName,
            phoneNumber: editForm.phoneNumber,
            newPassword: editForm.newPassword
        };
        if (hasPasswordChanged) {
            updatedPayload.newPassword = editForm.newPassword;
        }
        // If phone or password changed, show OTP modal first
        if (hasPhoneChanged || hasPasswordChanged) {
            // Store the payload for after OTP verification
            setPendingUpdate(updatedPayload);
            // Show OTP modal and send OTP
            setOtpState(prev => ({
                ...prev,
                showOtpModal: true,
                otpCode: '',
                otpSent: false,
                countdown: 0
            }));
            await resendOtp(userData.email)
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
            const response = await updateProfile(updatedPayload);
            if (response?.status) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                getProfileData();
            } else {
                toast.error(response?.message || "Failed to update profile.");
            }
        }
    };

    const handleResendOTP = async () => {
        try {
            await resendOtp(userData.email)
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
            console.log("error while resend otp", error)
            toast.error("Failed to resend OTP.");
        }
    }

    const getSubscriptionBadge = () => {
        switch (subscription.type) {
            case 'premium':
                return 'bg-purple-700 text-white';
            case 'basic':
                return 'bg-slate-600 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    const handleLogout = async () => {
        const response = await logoutApi("user");
        if (response?.status) {
            authStore.logout()
            router.replace('/login');
        }
    };

    return (
        <div className="min-h-screen flex gap-6 p-8">
            <div className="w-full">
                {/* Profile Header */}
                <div className="bg-slate-800/50 backdrop-blur-sm border  border-slate-700/50 rounded-2xl shadow-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative group">
                            <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center ring-4 ring-purple-500/20">
                                {userData.profilePicture ? (
                                    <Image src={userData.profilePicture} alt="Profile" fill className="w-28 h-28 rounded-2xl object-cover" />
                                ) : (
                                    <User className="w-14 h-14 text-white" />
                                )}
                            </div>
                            {isEditing && (
                                <button className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-xl transition-all duration-200 shadow-lg">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            )}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                {isEditing ? (
                                    <div className="space-y-4 w-full">
                                        <label className="text-slate-300 font-medium">Email Address</label>
                                        <input type="email" value={userData.email} disabled readOnly className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed" />
                                        <p className="text-slate-500 text-xs">Email cannot be changed</p>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                            {userData.fullName}
                                        </h1>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${getSubscriptionBadge()}`}>
                                            <span className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                {subscription.type} Plan
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
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 shadow-lg font-medium">
                                        Save Changes
                                    </button>
                                    <button onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
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
                                {/* Subscription Status */}
                                <SubscriptionCard />
                                {/* Expert Consultation Slots */}
                                {subscription.type !== 'free' && (
                                    <ExpertConsultationCard />
                                )}
                            </div>
                        )}

                        {activeTab === 'purchases' && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 w-full">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    Purchase History
                                </h3>
                                <div className="space-y-4 w-full">
                                    {purchaseHistory && purchaseHistory.map((purchase) => (
                                        <div key={purchase.id} className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200 w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-white text-lg">{purchase.productName}</h4>
                                                    <p className="text-slate-400 capitalize mb-1">{purchase.type.replace('-', ' ')}</p>
                                                    <p className="text-slate-500 text-sm">{purchase.createdAt}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-white text-xl">${purchase.amount}</p>
                                                    <span className={`text-sm px-3 py-1 rounded-lg font-medium ${purchase.status === 'completed'
                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                        }`}>
                                                        {purchase.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                {/* Profile Settings */}
                                {isEditing && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            Profile Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Full name */}
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium flex items-center gap-2 ">Full name</label>
                                                <input type="text" value={editForm.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Full Name"
                                                    className=" w-full   text-white bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                                />
                                            </div>

                                            {/* Phone Number */}
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

                                {/* Password Change */}
                                {isEditing && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg"> <Lock className="w-5 h-5 text-white" /></div>
                                            Change Password
                                        </h3>
                                        <div className="space-y-6">
                                            {/* New Password */}
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

                                            {/* Confirm Password */}
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

                                            {/* Password Requirements */}
                                            {(editForm.newPassword || editForm.confirmPassword) && (
                                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                                                    <h4 className="text-slate-300 font-medium mb-3">Password Requirements:</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                        <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            At least 8 characters
                                                        </div>
                                                        <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-400' : 'text-slate-400'}`}>
                                                            {passwordValidation.hasUppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                            One uppercase letter
                                                        </div>
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
                                {/* Notification Settings */}
                                {!isEditing && <NotificationSettings />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <QuickStats />
                {subscription.type === 'free' && (
                    <UpgradePlanCard />
                )}
                <AchievementsCard />
            </div>
        </div>
    );
};

export default UserProfile;