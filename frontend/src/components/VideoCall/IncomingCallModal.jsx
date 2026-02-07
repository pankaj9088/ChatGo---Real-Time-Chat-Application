import { useEffect, useState } from 'react';
import { FaPhone, FaTimes, FaVideo } from 'react-icons/fa';

const IncomingCallModal = ({ caller, onAccept, onReject }) => {
    const [ringing, setRinging] = useState(true);

    useEffect(() => {
        // Play ringtone (optional - you can add audio element)
        const audio = new Audio('/ringtone.mp3');
        audio.loop = true;
        audio.play().catch(e => console.log('Audio play failed:', e));

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-panel rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
                {/* Caller Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className={`relative mb-4 ${ringing ? 'animate-pulse' : ''}`}>
                        <img
                            src={caller?.avatar || 'https://via.placeholder.com/150'}
                            alt={caller?.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3 shadow-lg">
                            <FaVideo className="text-white text-xl" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        {caller?.name || 'Unknown'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Incoming video call...
                    </p>
                </div>

                {/* Call Animation */}
                <div className="flex justify-center mb-8">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-6">
                    {/* Reject Button */}
                    <button
                        onClick={onReject}
                        className="group relative flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95">
                            <FaTimes className="text-white text-2xl" />
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Decline
                        </span>
                    </button>

                    {/* Accept Button */}
                    <button
                        onClick={onAccept}
                        className="group relative flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse">
                            <FaPhone className="text-white text-2xl" />
                        </div>
                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Accept
                        </span>
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Make sure your camera and microphone are ready
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
