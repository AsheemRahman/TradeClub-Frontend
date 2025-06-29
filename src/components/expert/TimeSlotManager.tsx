import React, { useState } from 'react';
import { AvailabilitySlot } from '@/types/sessionTypes';
import { Edit, Plus, Save, Trash2, X } from "lucide-react";


interface TimeSlotForm {
    startTime: string;
    endTime: string;
}

interface TimeSlotManagerProps {
    selectedDate: Date | null;
    availableSlots: AvailabilitySlot[];
    onSlotsUpdate: (slots: AvailabilitySlot[]) => void;
}

export const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({ selectedDate, availableSlots, onSlotsUpdate }) => {
    const [showAddTimeForm, setShowAddTimeForm] = useState(false);
    const [editingSlot, setEditingSlot] = useState<string | null>("");
    const [newTimeSlots, setNewTimeSlots] = useState<TimeSlotForm[]>([{ startTime: '', endTime: '' }]);
    const [editTimeSlot, setEditTimeSlot] = useState<TimeSlotForm>({ startTime: '', endTime: '' });

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const addNewTimeSlot = () => {
        setNewTimeSlots([...newTimeSlots, { startTime: '', endTime: '' }]);
    };

    const removeTimeSlot = (index: number) => {
        if (newTimeSlots.length > 1) {
            setNewTimeSlots(newTimeSlots.filter((_, i) => i !== index));
        }
    };

    const updateNewTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const updated = newTimeSlots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
        );
        setNewTimeSlots(updated);
    };

    const getDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const saveNewTimeSlots = () => {
        if (!selectedDate) return;
        const dateStr = getDateString(selectedDate);
        const expertId = localStorage.getItem("expertId") || "temp-id";
        const newSlots = newTimeSlots
            .filter(slot => slot.startTime && slot.endTime)
            .map((slot,) => ({
                expertId,
                date: dateStr,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: false
            }));
        onSlotsUpdate([...availableSlots, ...newSlots]);
        setNewTimeSlots([{ startTime: '', endTime: '' }]);
        setShowAddTimeForm(false);
    };

    const startEditSlot = (slot: AvailabilitySlot) => {
        setEditingSlot(slot._id ?? null);
        setEditTimeSlot({ startTime: slot.startTime, endTime: slot.endTime });
    };

    const saveEditSlot = () => {
        const updated = availableSlots.map(slot =>
            slot._id === editingSlot
                ? { ...slot, startTime: editTimeSlot.startTime, endTime: editTimeSlot.endTime }
                : slot
        );
        onSlotsUpdate(updated);
        setEditingSlot(null);
    };

    const deleteSlot = (slotId: string | null) => {
        const updated = availableSlots.filter(slot => slot._id !== slotId);
        onSlotsUpdate(updated);
    };

    if (!selectedDate) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400 text-lg">Select a date to manage time slots</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setShowAddTimeForm(!showAddTimeForm)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Time
                </button>
            </div>

            {showAddTimeForm && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Add Time Slots for {selectedDate.toDateString()}</h3>

                    {newTimeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                            <input type="time" value={slot.startTime} onChange={(e) => updateNewTimeSlot(index, 'startTime', e.target.value)}
                                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
                            />
                            <span className="text-gray-400">to</span>
                            <input type="time" value={slot.endTime} onChange={(e) => updateNewTimeSlot(index, 'endTime', e.target.value)}
                                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
                            />
                            {newTimeSlots.length > 1 && (
                                <button onClick={() => removeTimeSlot(index)} className="text-red-500 hover:text-red-400 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-3 mt-6">
                        <button onClick={addNewTimeSlot}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Slot
                        </button>
                        <button onClick={saveNewTimeSlots}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save All Slots
                        </button>
                        <button onClick={() => setShowAddTimeForm(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                    Time Slots for {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </h3>

                {availableSlots.length > 0 ? (
                    <div className="space-y-3">
                        {availableSlots.map((slot) => (
                            <div key={slot._id}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 ${slot.isBooked ? 'bg-red-900 border-red-700' : 'bg-gray-700 border-gray-600'}`}
                            >
                                {editingSlot === slot._id ? (
                                    <div className="flex items-center gap-4 flex-1">
                                        <input type="time" value={editTimeSlot.startTime} onChange={(e) => setEditTimeSlot({ ...editTimeSlot, startTime: e.target.value })}
                                            className="bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-orange-500 focus:outline-none"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input type="time" value={editTimeSlot.endTime} onChange={(e) => setEditTimeSlot({ ...editTimeSlot, endTime: e.target.value })}
                                            className="bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-orange-500 focus:outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={saveEditSlot} className="text-green-500 hover:text-green-400 p-2">
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingSlot(null)} className="text-gray-500 hover:text-gray-400 p-2">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-medium">
                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm ${slot.isBooked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                                                {slot.isBooked ? 'Booked' : 'Available'}
                                            </span>
                                        </div>

                                        {!slot.isBooked && (
                                            <div className="flex gap-2">
                                                <button onClick={() => startEditSlot(slot)} className="text-blue-500 hover:text-blue-400 p-2">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteSlot(slot._id ?? null)} className="text-red-500 hover:text-red-400 p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">
                        No time slots created for this date. Click &quot;Add Time&quot; to create availability.
                    </p>
                )}
            </div>
        </div>
    );
};