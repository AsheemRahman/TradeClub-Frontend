'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, DollarSign, MapPin, Shield, Award, ChevronLeft, ChevronRight, TrendingUp, BarChart3, User, Phone, Mail, Check, Star, Calendar } from 'lucide-react';
import { DaySchedule, IExpert, IExpertAvailability, TimeSlot } from '@/types/bookingTypes';
import { getExpertAvailability, getExpertById } from '@/app/service/user/userApi';


const BookingPage = () => {
    const params = useParams();
    const router = useRouter();
    const expertId = params.expertId as string;

    // State management
    const [expert, setExpert] = useState<IExpert | null>(null);
    const [availability, setAvailability] = useState<IExpertAvailability[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [bookingStep, setBookingStep] = useState<'schedule' | 'details' | 'payment'>('schedule');
    const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', phone: '', message: '' });

    // Fetch expert and availability data
    useEffect(() => {
        const fetchExpertData = async () => {
            try {
                setLoading(true);
                const expertResponse = await getExpertById(expertId);
                if (!expertResponse.status) throw new Error('Expert not found');
                setExpert(expertResponse.expert);
                // Fetch availability for the current and next few weeks
                await fetchAvailability();
            } catch (error) {
                console.error('Error fetching expert data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpertData();
    }, [expertId]);

    // Fetch availability when week changes
    useEffect(() => {
        if (expert) {
            fetchAvailability();
        }
    }, [currentWeek, expert]);

    const fetchAvailability = async () => {
        try {
            setLoadingAvailability(true);
            // Calculate date range for current week
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() + (currentWeek * 7));
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);
            // const response = await fetch(`/api/experts/${expertId}/availability?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
            const response = await getExpertAvailability(expertId, startDate, endDate);
            if (!response.status) throw new Error('Failed to fetch availability');
            setAvailability(response.availability);
        } catch (error) {
            console.error('Error fetching availability:', error);
            setAvailability([]);
        } finally {
            setLoadingAvailability(false);
        }
    };

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
                const timeString = current.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
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

    const handleSlotBooking = async () => {
        if (!selectedDate || !selectedSlot || !expert) return;

        try {
            // Create booking
            const bookingData = {
                expertId: expert.id,
                date: selectedDate,
                timeSlot: selectedSlot.time,
                availabilityId: selectedSlot.availabilityId,
                clientDetails: bookingDetails
            };

            const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(bookingData), });
            if (!response.status) {
                throw new Error('Failed to create booking');
            }
            alert('Booking confirmed! You will receive a confirmation email shortly.');
        } catch (error) {
            console.error('Error confirming booking:', error);
            alert('Failed to confirm booking. Please try again.');
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
                                                            <button
                                                                key={slot.id}
                                                                onClick={() => slot.available && handleSlotSelect(day.date, slot)}
                                                                disabled={!slot.available}
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
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Full Name *
                                            </label>
                                            <input type="text" value={bookingDetails.name} onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email Address *
                                            </label>
                                            <input type="email" value={bookingDetails.email} onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </label>
                                            <input type="tel" value={bookingDetails.phone} onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Message (Optional)
                                            </label>
                                            <textarea value={bookingDetails.message} onChange={(e) => setBookingDetails({ ...bookingDetails, message: e.target.value })} rows={4}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Tell the expert what you'd like to discuss..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button onClick={() => setBookingStep('schedule')}
                                            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button onClick={handleSlotBooking} disabled={!bookingDetails.name || !bookingDetails.email}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Book the Appointment
                                        </button>
                                    </div>
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