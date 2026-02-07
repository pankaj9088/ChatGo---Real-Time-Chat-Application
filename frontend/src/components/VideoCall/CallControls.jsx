import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

const CallControls = ({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onEndCall }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center justify-center gap-6">
                {/* Mute/Unmute */}
                <button
                    onClick={onToggleMute}
                    className={`p-4 rounded-full transition-all ${isMuted
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? (
                        <FaMicrophoneSlash className="text-white text-2xl" />
                    ) : (
                        <FaMicrophone className="text-white text-2xl" />
                    )}
                </button>

                {/* Video On/Off */}
                <button
                    onClick={onToggleVideo}
                    className={`p-4 rounded-full transition-all ${isVideoOff
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                >
                    {isVideoOff ? (
                        <FaVideoSlash className="text-white text-2xl" />
                    ) : (
                        <FaVideo className="text-white text-2xl" />
                    )}
                </button>

                {/* End Call */}
                <button
                    onClick={onEndCall}
                    className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-all"
                    title="End call"
                >
                    <FaPhoneSlash className="text-white text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default CallControls;
