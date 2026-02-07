import { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaLink, FaImage } from 'react-icons/fa';
import { getChatMedia } from '../../services/messageService';

const ChatMediaSidebar = ({ chat, onClose }) => {
    const [mediaItems, setMediaItems] = useState([]);
    const [activeTab, setActiveTab] = useState('media'); // 'media', 'docs'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const data = await getChatMedia(chat._id);
                setMediaItems(data);
            } catch (error) {
                console.error('Error fetching chat media:', error);
            } finally {
                setLoading(false);
            }
        };
        if (chat?._id) {
            fetchMedia();
        }
    }, [chat._id]);

    const photosAndVideos = mediaItems.filter(
        (m) => m.mediaType === 'image' || m.mediaType === 'video'
    );
    // Assuming 'file' or 'document' type from messageService
    const documents = mediaItems.filter((m) => m.mediaType === 'file' || m.mediaType === 'document');

    return (
        <div className="w-80 lg:w-96 h-full bg-light-panel dark:bg-dark-panel border-l border-light-border dark:border-dark-border flex flex-col z-20 shadow-xl">
            {/* Header */}
            <div className="h-16 flex items-center px-4 bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border">
                <button onClick={onClose} className="mr-4 text-gray-600 dark:text-gray-400">
                    <FaTimes />
                </button>
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Contact Info</h2>
            </div>

            {/* Profile Info (Brief) */}
            <div className="p-6 flex flex-col items-center border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-panel">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Media, Links, and Docs</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-light-border dark:border-dark-border">
                <button
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'media'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('media')}
                >
                    Media
                </button>
                <button
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'docs'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('docs')}
                >
                    Docs
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-light-bg dark:bg-dark-bg p-2">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'media' && (
                            <div className="grid grid-cols-3 gap-1">
                                {photosAndVideos.length > 0 ? (
                                    photosAndVideos.map((item) => (
                                        <div key={item._id} className="relative aspect-square cursor-pointer group">
                                            {item.mediaType === 'video' ? (
                                                <video
                                                    src={item.mediaUrl}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={item.mediaUrl}
                                                    alt="Media"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                        No media shared
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div className="space-y-2 p-2">
                                {documents.length > 0 ? (
                                    documents.map((item) => (
                                        <div key={item._id} className="flex items-center gap-3 p-3 bg-white dark:bg-dark-panel rounded-lg shadow-sm">
                                            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center">
                                                <FaFileAlt />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 dark:text-white hover:underline truncate block">
                                                    Document
                                                </a>
                                                <p className="text-xs text-gray-500">
                                                    {/* Date logic if available in item */}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                        No documents shared
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatMediaSidebar;
