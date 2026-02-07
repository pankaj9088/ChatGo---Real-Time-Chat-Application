import { useState, useEffect, useRef, useCallback } from 'react';
import { CALL_STATUS } from '../utils/constants';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useWebRTC = (socket, userId) => {
    const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [caller, setCaller] = useState(null);
    const [remoteUserId, setRemoteUserId] = useState(null);

    const peerConnection = useRef(null);
    const pendingCandidates = useRef([]);

    // Initialize peer connection
    const createPeerConnection = useCallback((targetUserId) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate && socket && targetUserId) {
                socket.emit('call:ice-candidate', {
                    to: targetUserId,
                    candidate: event.candidate,
                });
            }
        };

        pc.ontrack = (event) => {
            console.log('Remote track received:', event.streams[0]);
            setRemoteStream(event.streams[0]);
        };

        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            if (pc.connectionState === 'connected') {
                setCallStatus(CALL_STATUS.CONNECTED);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                endCall();
            }
        };

        return pc;
    }, [socket]);

    // Start call
    const startCall = async (recipientId, recipientData) => {
        if (!userId) {
            console.error('Cannot start call: No user ID available');
            return;
        }

        try {
            setCallStatus(CALL_STATUS.CALLING);
            setCaller(recipientData);
            setRemoteUserId(recipientId);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setLocalStream(stream);

            peerConnection.current = createPeerConnection(recipientId);

            stream.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, stream);
            });

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit('call:initiate', {
                to: recipientId,
                offer,
                from: userId,
            });
        } catch (error) {
            console.error('Error starting call:', error);
            endCall();
        }
    };

    // Answer call
    const answerCall = async (offer, callerData) => {
        try {
            setCallStatus(CALL_STATUS.RINGING);
            setCaller(callerData);
            setRemoteUserId(callerData._id);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setLocalStream(stream);

            peerConnection.current = createPeerConnection(callerData._id);

            stream.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, stream);
            });

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

            // Add pending ICE candidates
            pendingCandidates.current.forEach((candidate) => {
                peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            });
            pendingCandidates.current = [];

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            // Force status to CONNECTED before emitting
            setCallStatus(CALL_STATUS.CONNECTED);

            socket.emit('call:answer', {
                to: callerData._id,
                answer,
            });
        } catch (error) {
            console.error('Error answering call:', error);
            endCall();
        }
    };

    // Reject call
    const rejectCall = () => {
        if (remoteUserId && socket) {
            socket.emit('call:reject', { to: remoteUserId });
        }
        endCall();
    };

    // End call
    const endCall = () => {
        if (remoteUserId && socket) {
            socket.emit('call:end', { to: remoteUserId });
        }

        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }

        if (peerConnection.current) {
            peerConnection.current.close();
        }

        setLocalStream(null);
        setRemoteStream(null);
        setCallStatus(CALL_STATUS.IDLE);
        setCaller(null);
        setRemoteUserId(null);
        setIsMuted(false);
        setIsVideoOff(false);
        peerConnection.current = null;
    };

    // Toggle mute
    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('call:answered', async ({ answer }) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                setCallStatus(CALL_STATUS.CONNECTED);
            }
        });

        socket.on('call:ice-candidate', async ({ candidate }) => {
            if (peerConnection.current && peerConnection.current.remoteDescription) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                pendingCandidates.current.push(candidate);
            }
        });

        socket.on('call:ended', () => {
            endCall();
        });

        socket.on('call:rejected', () => {
            endCall();
        });

        return () => {
            socket.off('call:answered');
            socket.off('call:ice-candidate');
            socket.off('call:ended');
            socket.off('call:rejected');
        };
    }, [socket]);

    return {
        callStatus,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        caller,
        startCall,
        answerCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
    };
};
