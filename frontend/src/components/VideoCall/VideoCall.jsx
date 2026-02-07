import { useEffect, useRef } from 'react';
import { CALL_STATUS } from '../../utils/constants';
import CallControls from './CallControls';
import { FaTimes } from 'react-icons/fa';

const VideoCall = ({ webRTC }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && webRTC.localStream) {
            localVideoRef.current.srcObject = webRTC.localStream;
        }
    }, [webRTC.localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && webRTC.remoteStream) {
            remoteVideoRef.current.srcObject = webRTC.remoteStream;
        }
    }, [webRTC.remoteStream]);

    const getStatusText = () => {
        switch (webRTC.callStatus) {
            case CALL_STATUS.CALLING:
                return 'Calling...';
            case CALL_STATUS.RINGING:
                return 'Ringing...';
            case CALL_STATUS.CONNECTED:
                return 'Connected';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <h3 className="text-xl font-semibold">{webRTC.caller?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-300">{getStatusText()}</p>
                    </div>
                    <button
                        onClick={webRTC.endCall}
                        className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    >
                        <FaTimes className="text-white text-xl" />
                    </button>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 relative">
                {/* Remote Video */}
                {webRTC.remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <div className="text-center">
                            <img
                                src={webRTC.caller?.avatar || 'https://via.placeholder.com/150'}
                                alt={webRTC.caller?.name}
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                            />
                            <p className="text-white text-lg">Waiting for {webRTC.caller?.name}...</p>
                        </div>
                    </div>
                )}

                {/* Local Video */}
                {webRTC.localStream && (
                    <div className="absolute bottom-24 right-6 w-40 h-30 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror"
                        />
                    </div>
                )}
            </div>

            {/* Controls */}
            <CallControls
                isMuted={webRTC.isMuted}
                isVideoOff={webRTC.isVideoOff}
                onToggleMute={webRTC.toggleMute}
                onToggleVideo={webRTC.toggleVideo}
                onEndCall={webRTC.endCall}
            />
        </div>
    );
};

export default VideoCall;
