"use client"

import React, { useState } from 'react';
import { User, Edit3, CreditCard, Clock, MessageCircle, Bell, Settings, Calendar, Star, Package, TrendingUp, Award, Shield, Eye, EyeOff, Phone, Lock, Check, X } from 'lucide-react';
import Image from 'next/image';


const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState({ new: false, confirm: false });

    // Mock user data - replace with actual data from your API
    const [userData, setUserData] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        profilePicture: null,
        location: 'New York, USA',
        subscription: {
            type: 'free',
            status: 'active',
            endDate: '2024-12-31'
        },
        expertConsultation: {
            availableSlots: 3,
            usedSlots: 2,
            totalSlots: 5
        },
        notifications: {
            email: true,
            sms: false,
            push: true,
            expertSlots: true
        }
    });

    // Form states for editing
    const [editForm, setEditForm] = useState({
        fullName: '',
        location: '',
        phoneNumber: '',
        newPassword: '',
        confirmPassword: ''
    });

    // OTP verification states
    const [otpState, setOtpState] = useState({
        showOtpModal: false,
        otpCode: '',
        otpType: '', // 'phone' or 'password'
        isVerifying: false,
        otpSent: false,
        countdown: 0
    });

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        passwordsMatch: false
    });

    // Mock purchase history
    const purchaseHistory = [
        {
            id: 1,
            type: 'subscription',
            productName: 'Premium Plan',
            amount: 29.99,
            status: 'completed',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            type: 'expert-consultation',
            productName: 'Expert Consultation - 1 Hour',
            amount: 99.99,
            status: 'completed',
            createdAt: '2024-02-20'
        },
        {
            id: 3,
            type: 'credits',
            productName: 'Additional Credits Pack',
            amount: 19.99,
            status: 'completed',
            createdAt: '2024-03-10'
        }
    ];

    // Mock upcoming consultations
    const upcomingConsultations = [
        {
            id: 1,
            expertName: 'Dr. Sarah Johnson',
            scheduledAt: '2024-06-05T14:00:00Z',
            duration: 60,
            status: 'scheduled'
        },
        {
            id: 2,
            expertName: 'Prof. Michael Chen',
            scheduledAt: '2024-06-08T10:30:00Z',
            duration: 45,
            status: 'scheduled'
        }
    ];

    // Initialize edit form when editing starts
    const startEditing = () => {
        setEditForm({
            fullName: userData.fullName,
            location: userData.location,
            phoneNumber: userData.phoneNumber,
            newPassword: '',
            confirmPassword: ''
        });
        setIsEditing(true);
    };

    // Password validation helper - Fixed version
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


    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));

        if (field === 'newPassword' || field === 'confirmPassword') {
            const newPassword = field === 'newPassword' ? value : editForm.newPassword;
            const confirmPassword = field === 'confirmPassword' ? value : editForm.confirmPassword;
            validatePassword(newPassword, confirmPassword);
        }
    };

    // Send OTP
    const sendOtp = (type: string) => {
        setOtpState(prev => ({ ...prev, otpSent: true, countdown: 60, otpType: type }));

        // Simulate API call
        setTimeout(() => {
            console.log(`OTP sent for ${type} verification`);
        }, 1000);

        // Countdown timer
        const timer = setInterval(() => {
            setOtpState(prev => {
                if (prev.countdown <= 1) {
                    clearInterval(timer);
                    return { ...prev, countdown: 0 };
                }
                return { ...prev, countdown: prev.countdown - 1 };
            });
        }, 1000);
    };

    // Verify OTP
    // Verify OTP - Fixed version
    const verifyOtp = async () => {
        setOtpState(prev => ({ ...prev, isVerifying: true }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (otpState.otpCode === '123456') { // Mock OTP
            // Update user data based on verification type
            if (otpState.otpType === 'phone') {
                setUserData(prev => ({ ...prev, phoneNumber: editForm.phoneNumber }));
            } else if (otpState.otpType === 'password') {
                // Only update password if it was changed
                if (editForm.newPassword.length > 0) {
                    console.log('Password updated successfully');
                    // In a real app, you would call your API to update the password here
                }
            }

            setOtpState({
                showOtpModal: false,
                otpCode: '',
                otpType: '',
                isVerifying: false,
                otpSent: false,
                countdown: 0
            });

            // Only exit edit mode if we're not changing phone number
            if (otpState.otpType !== 'phone') {
                setIsEditing(false);
            }

            alert('Verification successful!');
        } else {
            alert('Invalid OTP. Please try again.');
            setOtpState(prev => ({ ...prev, isVerifying: false }));
        }
    };

    // Handle profile save
    const handleSaveProfile = () => {
        const hasPhoneChanged = editForm.phoneNumber !== userData.phoneNumber;
        const hasPasswordChanged = editForm.newPassword.length > 0;

        // Validate password if it's being changed
        if (hasPasswordChanged) {
            const isPasswordValid = validatePassword(editForm.newPassword, editForm.confirmPassword);
            if (!isPasswordValid) {
                alert('Please ensure password meets all requirements and passwords match.');
                return;
            }
        }

        // Update basic info first
        setUserData(prev => ({
            ...prev,
            fullName: editForm.fullName,
            location: editForm.location
        }));

        // Handle phone/password changes requiring OTP
        if (hasPhoneChanged || hasPasswordChanged) {
            const verificationType = hasPhoneChanged ? 'phone' : 'password';
            setOtpState(prev => ({
                ...prev,
                showOtpModal: true,
                otpType: verificationType,
                otpCode: '', // Reset previous OTP code
                otpSent: false,
                countdown: 0
            }));
            sendOtp(verificationType);
        } else {
            // No sensitive changes, just save
            setIsEditing(false);
            console.log('Profile updated:', userData);
        }
    };

    const getSubscriptionBadge = () => {
        switch (userData.subscription.type) {
            case 'premium':
                return 'bg-purple-700 text-white';
            case 'basic':
                return 'bg-slate-600 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen flex p-8">
            <div className="mx-auto  ">
                {/* Profile Header */}
                <div className="bg-slate-800/50 backdrop-blur-sm border  border-slate-700/50 rounded-2xl shadow-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative group">
                            <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center ring-4 ring-purple-500/20">
                                {userData.profilePicture ? (
                                    <Image src={userData.profilePicture} alt="Profile" className="w-28 h-28 rounded-2xl object-cover" />
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
                                        <input
                                            type="text"
                                            value={editForm.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            className="text-3xl font-bold text-white bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors w-full"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors w-full"
                                            placeholder="Location"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                            {userData.fullName}
                                        </h1>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize ${getSubscriptionBadge()}`}>
                                            <span className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                {userData.subscription.type} Plan
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                            {!isEditing && (
                                <>
                                    <p className="text-slate-300 mb-2 text-lg">{userData.email}</p>

                                    <p className="text-slate-400 mt-1">{userData.location}</p>
                                </>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSaveProfile}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 shadow-lg font-medium"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={startEditing}
                                    className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* OTP Verification Modal */}
                {otpState.showOtpModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Verify Your Identity</h3>
                                <p className="text-slate-400">
                                    {otpState.otpType === 'phone'
                                        ? `We've sent a verification code to ${editForm.phoneNumber}`
                                        : 'We\'ve sent a verification code to your registered email'
                                    }
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* OTP Input */}
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-medium">Verification Code</label>
                                    <input
                                        type="text"
                                        value={otpState.otpCode}
                                        onChange={(e) => setOtpState(prev => ({ ...prev, otpCode: e.target.value }))}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-purple-500 transition-colors"
                                        disabled={otpState.isVerifying}
                                    />
                                    <p className="text-slate-500 text-sm text-center">
                                        Code expires in 10 minutes
                                    </p>
                                </div>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    {otpState.countdown > 0 ? (
                                        <p className="text-slate-400 text-sm">
                                            Resend code in {otpState.countdown}s
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => sendOtp(otpState.otpType)}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                            disabled={otpState.isVerifying}
                                        >
                                            Resend verification code
                                        </button>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={verifyOtp}
                                        disabled={otpState.otpCode.length !== 6 || otpState.isVerifying}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-400 hover:to-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {otpState.isVerifying ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Verify
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setOtpState({
                                            showOtpModal: false,
                                            otpCode: '',
                                            otpType: '',
                                            isVerifying: false,
                                            otpSent: false,
                                            countdown: 0
                                        })}
                                        disabled={otpState.isVerifying}
                                        className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Help Text */}
                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                                    <p className="text-slate-400 text-sm text-center">
                                        <strong>For demo purposes:</strong> Use code <span className="font-mono bg-slate-600 px-2 py-1 rounded text-white">123456</span> to verify
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-8 ">
                                {/* Subscription Status */}
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                            <Package className="w-5 h-5 text-white" />
                                        </div>
                                        Subscription Status
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                                            <p className="text-slate-400 text-sm mb-1">Current Plan</p>
                                            <p className="font-bold text-white text-lg capitalize">{userData.subscription.type}</p>
                                        </div>
                                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                                            <p className="text-slate-400 text-sm mb-1">Status</p>
                                            <p className={`font-bold text-lg flex items-center gap-2 ${userData.subscription.status === 'active' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${userData.subscription.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                                    }`}></div>
                                                {userData.subscription.status}
                                            </p>
                                        </div>
                                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                                            <p className="text-slate-400 text-sm mb-1">Renewal Date</p>
                                            <p className="font-bold text-white text-lg">{formatDate(userData.subscription.endDate)}</p>
                                        </div>
                                        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 flex items-center">
                                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 font-medium shadow-lg">
                                                Manage Subscription
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expert Consultation Slots */}
                                {userData.subscription.type !== 'free' && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                                                <MessageCircle className="w-5 h-5 text-white" />
                                            </div>
                                            Expert Consultation Slots
                                        </h3>
                                        <div className="grid grid-cols-3 gap-6 mb-6">
                                            <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                                                <p className="text-3xl font-bold text-blue-400 mb-2">{userData.expertConsultation.availableSlots}</p>
                                                <p className="text-slate-400">Available</p>
                                            </div>
                                            <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                                                <p className="text-3xl font-bold text-slate-400 mb-2">{userData.expertConsultation.usedSlots}</p>
                                                <p className="text-slate-400">Used</p>
                                            </div>
                                            <div className="text-center bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                                                <p className="text-3xl font-bold text-green-400 mb-2">{userData.expertConsultation.totalSlots}</p>
                                                <p className="text-slate-400">Total</p>
                                            </div>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl hover:from-green-400 hover:to-teal-400 transition-all duration-200 font-medium shadow-lg">
                                            Book Expert Consultation
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'purchases' && (
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    Purchase History
                                </h3>
                                <div className="space-y-4">
                                    {purchaseHistory && purchaseHistory.map((purchase) => (
                                        <div key={purchase.id} className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-white text-lg">{purchase.productName}</h4>
                                                    <p className="text-slate-400 capitalize mb-1">{purchase.type.replace('-', ' ')}</p>
                                                    <p className="text-slate-500 text-sm">{formatDate(purchase.createdAt)}</p>
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
                                {upcomingConsultations.length > 0 ? (
                                    <div className="space-y-6">
                                        {upcomingConsultations.map((consultation) => (
                                            <div key={consultation.id} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:bg-slate-700/50 transition-all duration-200">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-white text-lg">{consultation.expertName}</h4>
                                                        <p className="text-slate-300 flex items-center gap-2 mb-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDateTime(consultation.scheduledAt)}
                                                        </p>
                                                        <p className="text-slate-300 flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            {consultation.duration} minutes
                                                        </p>
                                                    </div>
                                                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm px-3 py-1 rounded-lg font-medium">
                                                        {consultation.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-400 hover:to-purple-400 transition-all duration-200 font-medium">
                                                        Join Meeting
                                                    </button>
                                                    <button className="border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium">
                                                        Reschedule
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-center py-8">No upcoming consultations scheduled.</p>
                                )}
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
                                            {/* Phone Number */}
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={editForm.phoneNumber}
                                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                    placeholder="Enter phone number"
                                                />
                                                {editForm.phoneNumber !== userData.phoneNumber && editForm.phoneNumber && (
                                                    <p className="text-amber-400 text-sm flex items-center gap-1">
                                                        <Bell className="w-3 h-3" />
                                                        OTP verification required
                                                    </p>
                                                )}
                                            </div>

                                            {/* Current Email (Read-only) */}
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    disabled
                                                    className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed"
                                                />
                                                <p className="text-slate-500 text-xs">Email cannot be changed</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Password Change */}
                                {isEditing && (
                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                                                <Lock className="w-5 h-5 text-white" />
                                            </div>
                                            Change Password
                                        </h3>
                                        <div className="space-y-6">
                                            {/* New Password */}
                                            <div className="space-y-2">
                                                <label className="text-slate-300 font-medium">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.new ? "text" : "password"}
                                                        value={editForm.newPassword}
                                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
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
                                                    <input
                                                        type={showPassword.confirm ? "text" : "password"}
                                                        value={editForm.confirmPassword}
                                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
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
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                                            <Settings className="w-5 h-5 text-white" />
                                        </div>
                                        Notification Settings
                                    </h3>
                                    <div className="space-y-6">
                                        {Object.entries(userData.notifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
                                                <div>
                                                    <p className="font-semibold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                    <p className="text-slate-400 text-sm">
                                                        {key === 'email' && 'Receive notifications via email'}
                                                        {key === 'sms' && 'Receive notifications via SMS'}
                                                        {key === 'push' && 'Receive push notifications'}
                                                        {key === 'expertSlots' && 'Get notified about available expert slots'}
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={(e) => setUserData({
                                                            ...userData,
                                                            notifications: {
                                                                ...userData.notifications,
                                                                [key]: e.target.checked
                                                            }
                                                        })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-8 mx-auto ">
                {/* Quick Stats */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Quick Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Account Status</span>
                            <span className="font-semibold text-green-400 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Active
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Member Since</span>
                            <span className="font-semibold text-white">Jan 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Purchases</span>
                            <span className="font-semibold text-white">{purchaseHistory.length}</span>
                        </div>
                        {userData.subscription.type !== 'free' && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Expert Sessions</span>
                                <span className="font-semibold text-white">{userData.expertConsultation.usedSlots}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upgrade Card */}
                {userData.subscription.type === 'free' && (
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Upgrade Your Plan
                            </h3>
                            <p className="text-blue-100 mb-4">Get access to expert consultations and premium features.</p>
                            <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 border border-white/20">
                                View Plans
                            </button>
                        </div>
                    </div>
                )}

                {/* Achievement Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Achievements
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-slate-700/30 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-slate-300 text-sm">Profile Completed</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-700/30 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-slate-300 text-sm">First Purchase</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-700/30 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-slate-300 text-sm">Expert Session Booked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;