"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Upload, Calendar, MapPin, User, Briefcase, TrendingUp, Camera, FileText, CreditCard, Image } from 'lucide-react';
import { ExpertFormData } from '@/types/types';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { expertVerification } from '@/app/service/expert/expertApi';

interface FileUploadFieldProps {
    label: string;
    fieldName: keyof ExpertFormData;
    accept: string;
    icon: React.ElementType;
    onFileUpload: (fieldName: keyof ExpertFormData, file: File) => void;
    uploading: boolean;
}

interface UploadProgress {
    [key: string]: boolean;
}

const ExpertDetailsForm = () => {
    const [formData, setFormData] = useState<ExpertFormData>({
        email: "",
        phoneNumber: '',
        profilePicture: "",
        DOB: '',
        state: '',
        country: '',
        experience_level: '',
        year_of_experience: '',
        markets_Traded: '',
        trading_style: '',
        proof_of_experience: "",
        Introduction_video: "",
        Government_Id: "",
        selfie_Id: "",
    });

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
    const totalSteps = 4;
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        if (emailFromQuery) {
            setFormData(prev => ({ ...prev, email: emailFromQuery }));
        }
    }, [searchParams])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadFileToS3 = async (file: File, folder: string): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch('/api/upload', { method: 'POST', body: formData, });
            const result = await response.json();
            if (result.success) {
                return result.url;
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file. Please try again.');
            return null;
        }
    };

    const handleFileUpload = async (fieldName: keyof ExpertFormData, file: File) => {
        setUploadProgress(prev => ({ ...prev, [fieldName]: true }));

        try {
            // Determine folder based on field type
            let folder = 'general';
            if (fieldName === 'profilePicture') folder = 'profile-pictures';
            else if (fieldName === 'proof_of_experience') folder = 'experience-proofs';
            else if (fieldName === 'Introduction_video') folder = 'introduction-videos';
            else if (fieldName === 'Government_Id') folder = 'government-ids';
            else if (fieldName === 'selfie_Id') folder = 'selfie-ids';

            const uploadedUrl = await uploadFileToS3(file, folder);

            if (uploadedUrl) {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: uploadedUrl,
                }));
                toast.success('File uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file. Please try again.');
        } finally {
            setUploadProgress(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof ExpertFormData) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should not exceed 10MB');
                return;
            }

            handleFileUpload(fieldName, file);
        }
    };

    const validateStep = () => {
        if (currentStep === 1) {
            return (
                formData.phoneNumber.trim() !== '' &&
                formData.DOB.trim() !== '' &&
                formData.state.trim() !== '' &&
                formData.country.trim() !== '' &&
                formData.profilePicture.trim() !== ''
            );
        }
        if (currentStep === 2) {
            return (
                formData.experience_level.trim() !== '' &&
                formData.year_of_experience.trim() !== '' &&
                formData.markets_Traded.trim() !== '' &&
                formData.trading_style.trim() !== ''
            );
        }
        if (currentStep === 3) {
            return (
                formData.proof_of_experience.trim() !== '' &&
                formData.Introduction_video.trim() !== ''
            );
        }
        if (currentStep === 4) {
            return (
                formData.Government_Id.trim() !== '' &&
                formData.selfie_Id.trim() !== ''
            );
        }
        return false;
    };

    const nextStep = () => {
        if (!validateStep()) {
            toast.error("Please fill all the required fields before proceeding.");
            return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await expertVerification(formData);
            if (response?.status) {
                toast.success("Details submitted");
                router.replace('/expert/verification-pending');
            }
        } catch (error) {
            console.log("error while verification", error)
        }
    };

    const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, fieldName,
        accept,
        icon: Icon,
        uploading
    }) => {
        const isUploaded = formData[fieldName] && typeof formData[fieldName] === 'string' && formData[fieldName].startsWith('http');

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isUploaded
                    ? 'border-green-400 bg-green-50'
                    : uploading
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                    <input
                        type="file"
                        accept={accept}
                        onChange={(e) => handleFileChange(e, fieldName)}
                        className="hidden"
                        id={fieldName}
                        disabled={uploading}
                    />
                    <label htmlFor={fieldName} className={`cursor-pointer ${uploading ? 'pointer-events-none' : ''}`}>
                        {uploading ? (
                            <>
                                <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                <p className="mt-2 text-sm text-blue-600">Uploading...</p>
                            </>
                        ) : isUploaded ? (
                            <>
                                <div className="mx-auto h-12 w-12 text-green-500 flex items-center justify-center">
                                    ✓
                                </div>
                                <p className="mt-2 text-sm text-green-600">File uploaded successfully</p>
                                <p className="text-xs text-gray-500">Click to replace</p>
                            </>
                        ) : (
                            <>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </>
                        )}
                    </label>
                </div>
            </div>
        );
    };

    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#fefeeb]">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-gray-300">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen sm:px-6 lg:px-8">
            <div className="mx-auto ">
                <div className="bg-[#151231] rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-[#fefeeb]">Complete Your Expert Profile</h1>
                        <p className="text-gray-600 mt-2">Help us verify your expertise and create your professional profile</p>
                    </div>

                    <ProgressBar />

                    <div className="space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-[#fefeeb] flex items-center gap-2 underline">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                        <input type="email" name="email" value={formData.email || ''} readOnly
                                            className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} placeholder="+91 999 999 9999" onChange={handleInputChange} required
                                            className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Date of Birth
                                        </label>
                                        <input type="date" name="DOB" value={formData.DOB} onChange={handleInputChange} required
                                            className="w-full px-4 py-3 border  border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            State
                                        </label>
                                        <input type="text" name="state" value={formData.state} placeholder="Kerala" onChange={handleInputChange} required
                                            className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <input type="text" name="country" value={formData.country} placeholder="India" onChange={handleInputChange} required
                                            className="w-full px-4 py-3 border border-gray-300 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <FileUploadField
                                    label="Profile Picture"
                                    fieldName="profilePicture"
                                    accept="image/*"
                                    icon={Camera}
                                    onFileUpload={handleFileUpload}
                                    uploading={uploadProgress.profilePicture || false}
                                />
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-[#fefeeb] flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Trading Experience
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Experience Level
                                        </label>
                                        <select name="experience_level" value={formData.experience_level} onChange={handleInputChange}
                                            className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="" className='text-black'>Select Experience Level</option>
                                            <option value="Beginner" className='text-black'>Beginner</option>
                                            <option value="Intermediate" className='text-black'>Intermediate</option>
                                            <option value="Expert" className='text-black'>Expert</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Years of Experience
                                        </label>
                                        <input type="number" name="year_of_experience" value={formData.year_of_experience} placeholder="5" onChange={handleInputChange} min="0" max="20"
                                            className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Markets Traded
                                        </label>
                                        <select name="markets_Traded" value={formData.markets_Traded} onChange={handleInputChange}
                                            className="w-full px-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option value="" className='text-black'>Select Market</option>
                                            <option value="Stock" className='text-black'>Stock</option>
                                            <option value="Forex" className='text-black'>Forex</option>
                                            <option value="Crypto" className='text-black'>Crypto</option>
                                            <option value="Commodities" className='text-black'>Commodities</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Trading Style
                                        </label>
                                        <select name="trading_style" value={formData.trading_style} onChange={handleInputChange}
                                            className="w-full text-white px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="" className='text-black'>Select Trading Style</option>
                                            <option value="Scalping" className='text-black'>Scalping</option>
                                            <option value="Day Trading" className='text-black'>Day Trading</option>
                                            <option value="Swing Trading" className='text-black'>Swing Trading</option>
                                            <option value="Position Trading" className='text-black'>Position Trading</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-[#fefeeb] flex items-center gap-2 underline">
                                    <FileText className="w-5 h-5" />
                                    Proof of Experience
                                </h2>

                                <div className="space-y-6">
                                    <FileUploadField
                                        label="Proof of Experience (Trading statements, certificates, etc.)"
                                        fieldName="proof_of_experience"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        icon={FileText}
                                        onFileUpload={handleFileUpload}
                                        uploading={uploadProgress.proof_of_experience || false}
                                    />
                                    <FileUploadField
                                        label="Introduction Video"
                                        fieldName="Introduction_video"
                                        accept="video/*"
                                        icon={Camera}
                                        onFileUpload={handleFileUpload}
                                        uploading={uploadProgress.Introduction_video || false}
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Please provide documents that demonstrate your trading experience, such as:
                                        broker statements, trading certificates, or portfolio screenshots. Your introduction video should be 2-3 minutes explaining your trading background.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-300 flex items-center gap-2 underline">
                                    <CreditCard className="w-5 h-5 " />
                                    Identity Verification
                                </h2>

                                <div className="space-y-6">
                                    <FileUploadField
                                        label="Government ID (Driver's License, Passport, etc.)"
                                        fieldName="Government_Id"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        icon={CreditCard}
                                        onFileUpload={handleFileUpload}
                                        uploading={uploadProgress.Government_Id || false}
                                    />
                                    <FileUploadField
                                        label="Selfie with ID"
                                        fieldName="selfie_Id"
                                        accept="image/*"
                                        icon={Image}
                                        onFileUpload={handleFileUpload}
                                        uploading={uploadProgress.selfie_Id || false}
                                    />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Security Notice:</strong> Your identity documents are encrypted and stored securely.
                                        They are only used for verification purposes and will not be shared with third parties.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-6">
                            <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`} >
                                Previous
                            </button>

                            {currentStep < totalSteps ? (
                                <button type="button" onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    Next Step
                                </button>
                            ) : (
                                <button type="button" onClick={handleSubmit} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                                    Submit Application
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDetailsForm;