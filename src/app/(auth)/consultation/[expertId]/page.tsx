'use client'

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { Clock, DollarSign, MapPin, Shield, Award, ChevronLeft, ChevronRight, TrendingUp, BarChart3, Check, Star, Calendar, Phone, Mail, User, Users } from 'lucide-react';
import { BookingDetails, DaySchedule, IExpertAvailability, IExpertSlot, TimeSlot } from '@/types/bookingTypes';

import userApi from '@/app/service/user/userApi';
import orderApi from '@/app/service/user/orderApi';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { sloBookingValidation } from '@/app/utils/Validation';
import { showBookingConfirmation } from '@/app/utils/showBooking';
import { IUserProfile } from '@/types/types';
import { notifyConsultationScheduled } from '@/app/service/shared/notificationAPI';


const BookingPage = () => {
    const params = useParams();
    const router = useRouter();
    const expertId = params.expertId as string;

    const [expert, setExpert] = useState<IExpertSlot | null>(null);
    const [availability, setAvailability] = useState<IExpertAvailability[]>([])
    const [loading, setLoading] = useState(true);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [bookingStep, setBookingStep] = useState<'schedule' | 'details' | 'payment'>('schedule');

    const [bookingFor, setBookingFor] = useState<'self' | 'other'>('self');
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [loadingUser, setLoadingUser] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<BookingDetails>();

    // Fetch user profile when "self" is selected
    const fetchUserProfile = useCallback(async () => {
        if (bookingFor === 'self') {
            try {
                setLoadingUser(true);
                const response = await userApi.getUserProfile();
                if (response.status && response.userDetails) {
                    setUserProfile(response.userDetails);
                    setValue('name', response.userDetails.fullName);
                    setValue('email', response.userDetails.email);
                    setValue('phone', response.userDetails.phoneNumber || '');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Failed to fetch user profile');
            } finally {
                setLoadingUser(false);
            }
        }
    }, [bookingFor, setValue]);

    // Clear form when switching to "other"
    const handleBookingForChange = (value: 'self' | 'other') => {
        setBookingFor(value);
        if (value === 'other') {
            setValue('name', '');
            setValue('email', '');
            setValue('phone', '');
            setUserProfile(null);
        }
    };

    // Fetch user profile when bookingFor changes to 'self'
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const fetchAvailability = useCallback(async () => {
        try {
            setLoadingAvailability(true);
            // Calculate date range for current week
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() + (currentWeek * 7));
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            const response = await userApi.getExpertAvailability(expertId, startDate, endDate);
            if (!response.status) throw new Error('Failed to fetch availability');
            setAvailability(response.availability);
        } catch (error) {
            console.error('Error fetching availability:', error);
            setAvailability([]);
        } finally {
            setLoadingAvailability(false);
        }
    }, [currentWeek, expertId]);

    // Fetch expert and availability data
    useEffect(() => {
        const fetchExpertData = async () => {
            try {
                setLoading(true);
                const expertResponse = await userApi.getExpertById(expertId);
                if (!expertResponse.status) throw new Error('Expert not found');
                setExpert(expertResponse.expert);
                await fetchAvailability();
            } catch (error) {
                console.error('Error fetching expert data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpertData();
    }, [expertId, fetchAvailability]);

    // Fetch availability when week changes
    useEffect(() => {
        if (expert) {
            fetchAvailability();
        }
    }, [currentWeek, expert, fetchAvailability]);

    // Generate time slots from availability data
    const generateTimeSlotsFromAvailability = (date: string, availabilitySlots: IExpertAvailability[]): TimeSlot[] => {
        const dayAvailability = availabilitySlots.filter(slot => slot.date === date);
        if (dayAvailability.length === 0) return [];
        const slots: TimeSlot[] = [];
        dayAvailability.forEach((availability) => {
            const startTime = new Date(`${date}T${availability.startTime}`);
            const endTime = new Date(`${date}T${availability.endTime}`);
            // Generate hourly slots between start and end time
            const current = new Date(startTime);
            while (current < endTime) {
                const timeString = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                slots.push({
                    id: `${availability._id}-${current.getHours()}`,
                    time: timeString,
                    available: !availability.isBooked,
                    availabilityId: availability._id
                });
                current.setHours(current.getHours() + 1);
            }
        });
        return slots;
    };

    // Generate week schedule using real availability data
    const generateWeekSchedule = (weekOffset: number): DaySchedule[] => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (weekOffset * 7));
        const schedule: DaySchedule[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            const timeSlots = generateTimeSlotsFromAvailability(dateString, availability);
            schedule.push({
                date: dateString,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                slots: timeSlots
            });
        }
        return schedule;
    };
    const weekSchedule = generateWeekSchedule(currentWeek);
    const getMarketIcon = (market: string) => {
        switch (market) {
            case 'Stock': return <TrendingUp className="w-4 h-4" />;
            case 'Forex': return <DollarSign className="w-4 h-4" />;
            case 'Crypto': return <BarChart3 className="w-4 h-4" />;
            case 'Commodities': return <BarChart3 className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    const handleSlotSelect = (date: string, slot: TimeSlot) => {
        setSelectedDate(date);
        setSelectedSlot(slot);
    };

    const handleContinueToDetails = () => {
        if (selectedDate && selectedSlot) {
            setBookingStep('details');
        }
    };

    const handleSlotBooking = async (data: BookingDetails) => {
        if (!selectedDate || !selectedSlot || !expert) return;
        if (!selectedSlot.availabilityId) {
            toast.error("Slot availability ID is missing.");
            return;
        }
        try {
            const bookingData = {
                expertId: expert._id,
                date: selectedDate,
                timeSlot: selectedSlot.time,
                availabilityId: selectedSlot.availabilityId,
                clientDetails: data,
                bookingFor: bookingFor,
            };
            const response = await orderApi.slotBooking(bookingData);
            if (!response.status) {
                throw new Error('Failed to create booking');
            }
            await notifyConsultationScheduled(response.session._id, response.session.bookedAt)
            // Show success Swal
            showBookingConfirmation({
                expertName: expert.fullName,
                selectedDate,
                selectedTime: selectedSlot.time,
                onConfirmed: () => {
                    setSelectedDate('');
                    setSelectedSlot(null);
                    setBookingStep('schedule');
                    fetchAvailability();
                },
            });
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mx-5 rounded-lg">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!expert) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mx-5 rounded-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Expert not found</h1>
                    <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors" >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  mx-5 rounded-lg">
            <div className="container mx-auto px-5">
                {/* Header */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
                    <ChevronLeft className="w-5 h-5" />
                    Back to Experts
                </button>
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-lg shadow-2xl p-4 mb-4">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-4">
                                <div className="w-15 h-15 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Book a Session</h1>
                                    <p className="text-white/80 mt-1 text-md">Schedule your consultation with {expert.fullName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Expert Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                                        {expert.profilePicture ? (
                                            <Image src={expert.profilePicture} fill alt={expert.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            expert.fullName.split(' ').map(n => n[0]).join('')
                                        )}
                                    </div>
                                    {expert.isVerified === 'Approved' && (
                                        <div className="absolute -top-2 -left-2 bg-blue-600 rounded-full p-1">
                                            <Shield className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{expert.fullName}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Award className="w-3 h-3" />
                                        {expert.experience_level} • {expert.year_of_experience}+ years
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2">
                                    {getMarketIcon(expert.markets_Traded)}
                                    <span className="text-sm font-medium">{expert.markets_Traded}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">{expert.trading_style}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm">{expert.state}, {expert.country}</span>
                                </div>
                                {expert.rating && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-sm">{expert.rating}</span>
                                        <span className="text-gray-500 text-sm">({expert.reviews} reviews)</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                {selectedDate && selectedSlot && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-2">Selected Session</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                            <div>Time: {selectedSlot.time}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-lg p-8">
                            {/* Progress Steps */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bookingStep === 'schedule' ? 'bg-blue-600 text-white' : bookingStep === 'details' || bookingStep === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {bookingStep === 'details' || bookingStep === 'payment' ? <Check className="w-5 h-5" /> : '1'}
                                    </div>
                                    <span className={`font-medium ${bookingStep === 'schedule' ? 'text-blue-600' : 'text-gray-600'}`}>Schedule</span>
                                    <div className="w-25 h-px bg-gray-300"></div>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bookingStep === 'details' ? 'bg-blue-600 text-white' : bookingStep === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {bookingStep === 'payment' ? <Check className="w-5 h-5" /> : '2'}
                                    </div>
                                    <span className={`font-medium ${bookingStep === 'details' ? 'text-blue-600' : 'text-gray-600'}`}>Details</span>
                                </div>
                            </div>

                            {/* Schedule Selection */}
                            {bookingStep === 'schedule' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))} disabled={currentWeek === 0}
                                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setCurrentWeek(currentWeek + 1)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
                                        {weekSchedule.map((day, dayIndex) => (
                                            <div key={dayIndex} className="text-center">
                                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">{day.dayName}</h3>
                                                <div className="space-y-2 min-h-[200px]">
                                                    {loadingAvailability ? (
                                                        <div className="flex justify-center items-center h-32">
                                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                        </div>
                                                    ) : day.slots.length === 0 ? (
                                                        <div className="text-gray-400 text-sm py-4">
                                                            No slots available
                                                        </div>
                                                    ) : (
                                                        day.slots.map((slot) => (
                                                            <button key={slot.id} onClick={() => slot.available && handleSlotSelect(day.date, slot)} disabled={!slot.available}
                                                                className={`w-full p-3 rounded-lg text-sm font-medium transition-all ${selectedDate === day.date && selectedSlot?.id === slot.id
                                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                                    : slot.available
                                                                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                {slot.time}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <button onClick={handleContinueToDetails} disabled={!selectedDate || !selectedSlot}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continue to Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Booking Details */}
                            {bookingStep === 'details' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                                    {/* Booking For Selection */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Who is this booking for?
                                        </label>
                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => handleBookingForChange('self')}
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${bookingFor === 'self'
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <User className="w-5 h-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">For Myself</div>
                                                    <div className="text-sm opacity-75">Use my profile details</div>
                                                </div>
                                            </button>

                                            <button type="button" onClick={() => handleBookingForChange('other')}
                                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${bookingFor === 'other' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                <Users className="w-5 h-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">For Someone Else</div>
                                                    <div className="text-sm opacity-75">Enter their details</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit((data) => handleSlotBooking(data))}>
                                        {/* Show loading spinner when fetching user profile */}
                                        {loadingUser && bookingFor === 'self' && (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span className="ml-3 text-gray-600">Loading your profile...</span>
                                            </div>
                                        )}

                                        {/* Show user profile info when booking for self */}
                                        {bookingFor === 'self' && userProfile && !loadingUser && (
                                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                                <h4 className="font-semibold text-green-800 mb-2">Booking for yourself</h4>
                                                <div className="text-sm text-green-700">
                                                    <p><strong>Name:</strong> {userProfile.fullName}</p>
                                                    <p><strong>Email:</strong> {userProfile.email}</p>
                                                    {userProfile.phoneNumber && <p><strong>Phone:</strong> {userProfile.phoneNumber}</p>}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            {/* Name and Email - show inputs only for 'other' */}
                                            {bookingFor === 'other' && (
                                                <>
                                                    {/* Full Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            <User className="w-4 h-4 inline mr-2" /> Full Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            {...register("name", sloBookingValidation.name)}
                                                            placeholder="Enter full name"
                                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            <Mail className="w-4 h-4 inline mr-2" /> Email Address *
                                                        </label>
                                                        <input
                                                            type="email"
                                                            {...register("email", sloBookingValidation.email)}
                                                            placeholder="Enter email address"
                                                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
                                                    </div>
                                                </>
                                            )}

                                            {/* Phone - show for both self and other */}
                                            <div className={bookingFor === 'self' ? 'md:col-span-2' : ''}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Phone className="w-4 h-4 inline mr-2" /> Phone Number
                                                </label>
                                                <input type="tel" {...register("phone", sloBookingValidation.phone)} placeholder="Enter phone number" disabled={bookingFor === 'self' && !!userProfile?.phoneNumber}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>)}
                                            </div>

                                            {/* Message */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message (Please specify the reason)
                                                </label>
                                                <textarea {...register("message", sloBookingValidation.message)} rows={4} placeholder="Tell the expert what you'd like to discuss..."
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {errors.message && (<p className="text-red-500 text-sm mt-1">{errors.message.message}</p>)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button type="button" onClick={() => setBookingStep("schedule")}
                                                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button type="submit" disabled={loadingUser}
                                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loadingUser ? 'Loading...' : 'Book the Appointment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;