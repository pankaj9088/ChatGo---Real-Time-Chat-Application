import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const StatusViewer = ({ statusGroup, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const statuses = statusGroup.statuses;
    const currentStatus = statuses[currentIndex];

    useEffect(() => {
        setProgress(0);
        const duration = 5000; // 5 seconds per status
        const interval = 50; // Update every 50ms
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    handleNext();
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < statuses.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
            {/* Progress Bar */}
            <div className="absolute top-4 left-0 right-0 px-4 flex gap-1 z-10 w-full max-w-2xl mx-auto">
                {statuses.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-gray-600 rounded overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-100 ease-linear ${idx < currentIndex ? 'w-full' : idx === currentIndex ? '' : 'w-0'
                                }`}
                            style={{ width: idx === currentIndex ? `${progress}%` : undefined }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-0 right-0 px-4 flex items-center justify-between text-white z-10 w-full max-w-2xl mx-auto mt-2">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full">
                        <FaArrowLeft /> {/* Wait, imported FaTimes but used FaArrowLeft logic below. I should fix import*/}
                    </button>
                    <img
                        src={statusGroup.user.avatar || 'https://via.placeholder.com/40'}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="User"
                    />
                    <div>
                        <p className="font-semibold text-sm">{statusGroup.user.name}</p>
                        <p className="text-xs text-gray-300">
                            {new Date(currentStatus.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center w-full h-full relative">
                <button
                    onClick={handlePrev}
                    className="absolute left-4 p-4 text-white/50 hover:text-white z-20 hidden md:block"
                >
                    <FaChevronLeft size={30} />
                </button>

                {currentStatus.mediaType === 'video' ? (
                    <video
                        src={currentStatus.mediaUrl}
                        className="max-h-full max-w-full object-contain"
                        autoPlay
                        muted={false} // Maybe mute by default?
                    />
                ) : (
                    <img
                        src={currentStatus.mediaUrl}
                        alt={currentStatus.caption}
                        className="max-h-full max-w-full object-contain"
                    />
                )}

                <button
                    onClick={handleNext}
                    className="absolute right-4 p-4 text-white/50 hover:text-white z-20 hidden md:block"
                >
                    <FaChevronRight size={30} />
                </button>
            </div>

            {/* Caption */}
            {currentStatus.caption && (
                <div className="absolute bottom-10 text-white bg-black/50 px-4 py-2 rounded-lg max-w-lg text-center">
                    {currentStatus.caption}
                </div>
            )}
        </div>
    );
};

import { FaArrowLeft } from 'react-icons/fa'; // Fix import
export default StatusViewer;
