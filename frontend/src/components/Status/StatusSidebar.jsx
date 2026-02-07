import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { getStatuses, createStatus } from '../../services/statusService';
import { useAuth } from '../../context/AuthContext';

const StatusSidebar = ({ onClose, onViewStatus }) => {
    const [statusGroups, setStatusGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const { user } = useAuth();
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchStatuses = async () => {
        try {
            const data = await getStatuses();
            setStatusGroups(data);
        } catch (error) {
            console.error('Failed to fetch statuses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file) return;

        try {
            setUploading(true);
            await createStatus({ media: file });
            await fetchStatuses(); // Refresh list
        } catch (error) {
            console.error('Error uploading status', error);
            alert('Failed to upload status');
        } finally {
            setUploading(false);
        }
    };

    const myStatusGroup = statusGroups.find(g => g.user._id === user._id);
    const otherStatusGroups = statusGroups.filter(g => g.user._id !== user._id);

    return (
        <div className="w-96 h-full bg-light-panel dark:bg-dark-panel border-r border-light-border dark:border-dark-border flex flex-col z-20 overflow-hidden">
            {/* Header */}
            <div className="h-[108px] bg-indigo-600 flex items-end p-5 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full">
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <h2 className="text-xl font-medium">Status</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* My Status */}
                <div className="p-4 flex items-center gap-4 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer border-b border-light-border dark:border-dark-border">
                    <div className="relative">
                        <img
                            src={user?.avatar || 'https://via.placeholder.com/50'}
                            className={`w-12 h-12 rounded-full object-cover ${myStatusGroup ? 'ring-2 ring-primary p-0.5' : ''}`}
                            onClick={() => myStatusGroup ? onViewStatus(myStatusGroup) : fileInputRef.current.click()}
                            alt="My Status"
                        />
                        {/* Add Button Badge if no status or separate button? */}
                        {!myStatusGroup && (
                            <button
                                className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-dark-panel"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current.click();
                                }}
                            >
                                <FaPlus size={10} />
                            </button>
                        )}
                        {/* If status exists, add button separate? */}
                        {myStatusGroup && (
                            <button
                                className="absolute bottom-0 right-0 bg-gray-500 text-white rounded-full p-1 border-2 border-white dark:border-dark-panel"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent opening viewer
                                    fileInputRef.current.click();
                                }}
                            >
                                <FaPlus size={10} />
                            </button>
                        )}
                    </div>
                    <div className="flex-1" onClick={() => myStatusGroup ? onViewStatus(myStatusGroup) : fileInputRef.current.click()}>
                        <h3 className="font-semibold text-gray-900 dark:text-white">My Status</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {uploading ? 'Uploading...' : (myStatusGroup ? 'Tap to view your status update' : 'Tap to add status update')}
                        </p>
                    </div>
                </div>

                {/* Recent Updates */}
                {otherStatusGroups.length > 0 && (
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-4 uppercase">Recent updates</h3>
                        <div className="space-y-4">
                            {otherStatusGroups.map((group) => (
                                <div
                                    key={group.user._id}
                                    className="flex items-center gap-4 cursor-pointer"
                                    onClick={() => onViewStatus(group)}
                                >
                                    <div className="relative">
                                        <img
                                            src={group.user.avatar || 'https://via.placeholder.com/50'}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary p-0.5"
                                            alt={group.user.name}
                                        />
                                    </div>
                                    <div className="flex-1 border-b border-light-border dark:border-dark-border pb-4">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{group.user.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(group.statuses[group.statuses.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
            />
        </div>
    );
};

export default StatusSidebar;
