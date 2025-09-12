'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocketContext } from '@/context/socketContext';
import { useExpertStore } from '@/store/expertStore';
import { toast } from 'react-toastify';
import userApi from '@/app/service/user/userApi';
import { debounce } from 'lodash';
import VideoCallInterface from '@/components/shared/VideoCall/videoCallInterface';

export interface ISession {
    _id: string;
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: string;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
    updatedAt: string;
}


const ExpertVideoChat = () => {
    const params = useParams();
    const router = useRouter();
    const { socket } = useSocketContext() || {};
    const [sessionState, setSessionState] = useState<{
        data: ISession | null;
        isLoading: boolean;
        error: string | null;
    }>({
        data: null,
        isLoading: true,
        error: null,
    });
    const { expert } = useExpertStore();
    const sessionId = params?.id as string;

    const stableUser = useMemo(() => expert, [expert]);
    const stableSessionId = useMemo(() => sessionId, [sessionId]);

    const handleSessionUpdate = useMemo(() => {
        return debounce((data) => {
            if (data.sessionId === stableSessionId) {
                setSessionState((prev) => ({
                    ...prev,
                    data: prev.data ? { ...prev.data, status: data.status } : null,
                }));
                if (data.status === 'completed' || data.status === 'cancelled') {
                    toast.info('Session has ended');
                    router.push("/expert/appoinments");
                }
            }
        }, 100);
    }, [stableSessionId, router]);

    useEffect(() => {
        console.log('Socket instance in ExpertVideoChat:', socket);
        let isMounted = true;

        if (!stableSessionId || !stableUser) {
            if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Invalid session or user not authenticated' });
            return;
        }

        const fetchSessionDetails = async () => {
            try {
                const response = await userApi.getSessionDetails(stableSessionId);
                if (response.status) {
                    const session = response.session;

                    if (session.expertId !== stableUser.id) {
                        if (isMounted) setSessionState({ data: null, isLoading: false, error: 'You are not authorized to join this session' });
                        return;
                    }

                    const now = new Date();
                    const startTime = new Date(session.startTime);
                    const endTime = new Date(session.endTime);
                    const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);

                    if (now < tenMinutesBefore) {
                        if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Session join window not yet open (starts 10 minutes before)' });
                        return;
                    }

                    if (now > endTime || session.status === 'completed' || session.status === 'missed') {
                        if (isMounted) setSessionState({ data: null, isLoading: false, error: 'This session has already ended or been missed' });
                        return;
                    }

                    if (session.status === 'upcoming' && now >= endTime) {
                        await userApi.updateSessionStatus(session._id, 'missed');
                        session.status = 'missed';
                    }

                    localStorage.setItem(`session_${stableSessionId}`, JSON.stringify(session));
                    if (isMounted) setSessionState({ data: session, isLoading: false, error: null });
                } else {
                    if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Failed to load session details' });
                }
            } catch (err) {
                console.error('Error fetching session:', err);
                if (isMounted) setSessionState({ data: null, isLoading: false, error: 'Failed to load session details' });
            }
        };

        fetchSessionDetails();

        if (socket) {
            socket.on('session-updated', handleSessionUpdate);
            socket.on('end-session', async () => {
                console.log('end-session event received in expert side');
                try {
                    await userApi.updateSessionStatus(stableSessionId, "completed");
                    toast.info("Call has been ended by the student");
                } catch (err) {
                    console.error("Failed to update session:", err);
                    toast.error("Could not update session status");
                } finally {
                    router.push("/expert/appointments");
                }
            });

            return () => {
                socket.off('session-updated', handleSessionUpdate);
                socket.off('end-session');
                isMounted = false;
            };
        }
    }, [stableSessionId, stableUser, socket, handleSessionUpdate, router]);

    const { data: sessionData, isLoading, error } = sessionState;

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading session...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900">
                <div className="text-white text-xl mb-4">{error}</div>
                <button onClick={() => router.push("/expert/appointments")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Go back
                </button>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Session not found</div>
            </div>
        );
    }

    return (
        <div className="h-screen">
            <VideoCallInterface role={"expert"} />
        </div>
    );
};

export default ExpertVideoChat;