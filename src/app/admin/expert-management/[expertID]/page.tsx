'use client';

import { ArrowLeft, Mail, Phone, Calendar, MapPin, TrendingUp, Award, FileText, Video, Shield, User, CheckCircle, XCircle, Eye, X, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { IExpert } from '@/types/types';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, } from 'react';
import { approveExpert, declineExpert, getExpertById } from '@/app/service/admin/adminApi';


export default function ExpertDetailPage() {
    const params = useParams<{ expertID: string }>();
    const id = params?.expertID;

    const [expert, setExpert] = useState<IExpert | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [imageModal, setImageModal] = useState<{ src: string | undefined, alt: string } | null>(null);

    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

    const router = useRouter();

    const openImageModal = (src: string | undefined, alt: string) => {
        setImageModal({ src, alt });
    };
    const closeImageModal = () => {
        setImageModal(null);
    };
    const openRejectionModal = () => {
        setShowRejectionModal(true);
        setRejectionReason('');
    };
    const closeRejectionModal = () => {
        setShowRejectionModal(false);
        setRejectionReason('');
    };

    const fetchExpertDetails = useCallback(async () => {
        try {
            const response = await getExpertById(id);
            if (response.status) {
                setExpert(response.Expert);
            } else {
                setExpert(null);
            }
        } catch (err) {
            toast.error("Unable to fetch expert details. Please try again.");
            console.error("Error fetching expert:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            router.push("/admin/expert-management")
            return;
        }
        fetchExpertDetails();
    }, [id, router, fetchExpertDetails]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" role="status"></div>
                    <p className="text-white text-lg">Loading expert details...</p>
                </div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 text-xxl">Expert not found</p>
                </div>
            </div>
        );
    }

    const handleApprove = async () => {
        const response = await approveExpert(id);
        if (response.status) {
            toast.success("Expert Approved Successfully")
            fetchExpertDetails();
        }
    }
    const handleDecline = async () => {
        if (rejectionReason.trim() === '') {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsSubmittingRejection(true);
        try {
            const response = await declineExpert(id, rejectionReason);
            if (response.status) {
                toast.success("Expert Declined Successfully");
                closeRejectionModal();
                fetchExpertDetails();
            }
        } catch (error) {
            toast.error("Failed to decline expert. Please try again.");
            console.error("Error declining expert:", error);
        } finally {
            setIsSubmittingRejection(false);
        }
    }

    const commonRejectionReasons = [
        "Incomplete documentation",
        "Invalid or expired ID",
        "Insufficient trading experience",
        "Poor quality introduction video",
        "Unverifiable credentials",
        "Does not meet platform requirements"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br  p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors duration-200 mb-4 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to Expert Management</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative">
                                {expert.profilePicture !== "" ? (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/30 cursor-pointer hover:scale-105 transition-transform duration-200"
                                        onClick={() => openImageModal(expert.profilePicture, "Profile Picture")}>
                                        <Image src={expert.profilePicture!} alt="Profile" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="w-12 h-12 text-white/60" />
                                    </div>
                                )}
                                {expert.isVerified == "Approved" && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{expert.fullName}</h1>
                                        <div className="flex flex-wrap items-center gap-4 text-white/80">
                                            <span className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {expert.email}
                                            </span>
                                            {expert.phoneNumber && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    {expert.phoneNumber}
                                                </span>
                                            )}
                                        </div>

                                        {/* show verified and active */}
                                        {expert.isVerified == "Pending" &&
                                            <div className="flex gap-3 mt-4">
                                                <div className="px-3 py-2 rounded-full text-sm font-medium shadow-lg bg-red-500 text-white border-2 border-red-400">
                                                    {expert.isVerified}
                                                </div>
                                                <div className={`px-3 py-2 rounded-full text-sm font-medium shadow-lg ${expert.isActive
                                                    ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-300'
                                                    : 'bg-gray-800 text-white border-2 border-gray-600'}`}>
                                                    {expert.isActive ? 'Active' : 'Blocked'}
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    {expert.isVerified !== "Pending" ? (
                                        <div className="flex gap-3">
                                            <div className={`px-4 py-2 rounded-full text-sm font-medium  ${expert.isVerified === "Approved"
                                                ? 'bg-green-500 text-white border-2 border-green-400'
                                                : 'bg-red-500 text-white border-2 border-red-400'}`}>
                                                {expert.isVerified}
                                            </div>
                                            <div className={`px-4 py-2 rounded-full text-sm font-medium  ${expert.isActive
                                                ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-300'
                                                : 'bg-gray-800 text-white border-2 border-gray-600'}`}>
                                                {expert.isActive ? 'Active' : 'Blocked'}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white border border-green-500 hover:bg-green-400" onClick={handleApprove}>
                                                Approve
                                            </button>
                                            <button className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white border border-red-500/20 hover:bg-red-400" onClick={openRejectionModal}>
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-white/10">
                        <div className="flex overflow-x-auto">
                            {[
                                { id: 'profile', label: 'Profile Info', icon: User },
                                { id: 'trading', label: 'Trading Details', icon: TrendingUp },
                                { id: 'documents', label: 'Documents', icon: FileText }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                                        : 'border-transparent text-white/60 hover:text-white/80 hover:bg-white/5'
                                        }`}>
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { label: 'Date of Birth', value: expert.DOB ? new Date(expert.DOB).toDateString() : 'N/A', icon: Calendar },
                                    { label: 'Country', value: expert.country || 'N/A', icon: MapPin },
                                    { label: 'State', value: expert.state || 'N/A', icon: MapPin },
                                    { label: 'Phone', value: expert.phoneNumber || 'N/A', icon: Phone },
                                    { label: 'Email', value: expert.email, icon: Mail },
                                    { label: 'Status', value: expert.isActive ? 'Active' : 'Blocked', icon: expert.isActive ? CheckCircle : XCircle }
                                ].map((item, index) => (
                                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <item.icon className="w-5 h-5 text-purple-300" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white/60 text-sm font-medium">{item.label}</p>
                                                <p className="text-white text-lg font-semibold mt-1">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'trading' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Experience Level', value: expert.experience_level || 'N/A', icon: Award },
                                    { label: 'Years of Experience', value: expert.year_of_experience || 'N/A', icon: Calendar },
                                    { label: 'Markets Traded', value: expert.markets_Traded || 'N/A', icon: TrendingUp },
                                    { label: 'Trading Style', value: expert.trading_style || 'N/A', icon: TrendingUp }
                                ].map((item, index) => (
                                    <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                                <item.icon className="w-6 h-6 text-blue-300" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white/60 text-sm font-medium mb-2">{item.label}</p>
                                                <p className="text-white text-xl font-semibold">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-6">
                                {/* Introduction Video */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                            <Video className="w-5 h-5 text-red-300" />
                                        </div>
                                        <h3 className="text-white text-lg font-semibold">Introduction Video</h3>
                                    </div>
                                    {expert.Introduction_video ? (
                                        <video key={expert.Introduction_video} controls className="w-full max-w-2xl rounded-lg">
                                            <source src={expert.Introduction_video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <p className="text-white/60">No introduction video available</p>
                                    )}
                                </div>

                                {/* Document Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Proof of Experience', url: expert.proof_of_experience, icon: Award },
                                        { label: 'Government ID', url: expert.Government_Id, icon: Shield }
                                    ].map((doc, index) => (
                                        <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                    <doc.icon className="w-5 h-5 text-green-300" />
                                                </div>
                                                <h3 className="text-white text-lg font-semibold">{doc.label}</h3>
                                            </div>
                                            {doc.url && doc.url !== 'N/A' ? (
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200">
                                                    <Eye className="w-4 h-4" /> View Document
                                                </a>
                                            ) : (
                                                <p className="text-white/60">No document available</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Selfie with ID */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <User className="w-5 h-5 text-yellow-300" />
                                        </div>
                                        <h3 className="text-white text-lg font-semibold">Selfie with ID</h3>
                                    </div>
                                    {expert.selfie_Id ? (
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform duration-200"
                                            onClick={() => openImageModal(expert.selfie_Id, "Selfie with ID")}
                                        >
                                            <Image src={expert.selfie_Id} alt="Selfie with ID" className="object-cover" fill />
                                        </div>
                                    ) : (
                                        <p className="text-white/60">No selfie with ID available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {imageModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
                    <div className="relative max-w-4xl max-h-full">
                        <Image src={imageModal.src as string} alt={imageModal.alt} width={800} height={600} className="rounded-lg object-contain" />
                        <button onClick={closeImageModal} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <MessageSquare className="w-5 h-5 text-red-300" />
                                    </div>
                                    <h3 className="text-white text-xl font-semibold">Decline Expert</h3>
                                </div>
                                <button onClick={closeRejectionModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-white/80 mb-4">
                                    Please provide a reason for declining <span className="font-semibold">{expert.fullName}</span>&apos;s application:
                                </p>

                                {/* Quick Selection Buttons */}
                                <div className="mb-4">
                                    <p className="text-white/60 text-sm mb-2">Quick select:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {commonRejectionReasons.map((reason, index) => (
                                            <button key={index} onClick={() => setRejectionReason(reason)}
                                                className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${rejectionReason === reason
                                                    ? 'bg-red-500/20 border-red-400 text-red-300'
                                                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                                                    }`}
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter reason for rejection..." required
                                    className="w-full h-32 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={closeRejectionModal} className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors duration-200">
                                    Cancel
                                </button>
                                <button onClick={handleDecline} disabled={isSubmittingRejection || rejectionReason.trim() === ''}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isSubmittingRejection ? 'Declining...' : 'Decline Expert'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}