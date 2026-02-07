import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/userService';
import { FaTimes, FaCamera, FaPen, FaCheck, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
    const { user, logout, updateUser } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [status, setStatus] = useState(user?.about || '');
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        onClose();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            const updatedUser = await updateProfile({ avatar: file });
            updateUser(updatedUser);
        } catch (error) {
            console.error('Error updating avatar:', error);
            alert('Failed to update profile picture');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveName = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);
            const updatedUser = await updateProfile({ name });
            updateUser(updatedUser);
            setIsEditingName(false);
        } catch (error) {
            console.error('Error updating name:', error);
            alert('Failed to update name');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStatus = async () => {
        if (!status.trim()) return;

        try {
            setLoading(true);
            const updatedUser = await updateProfile({ about: status });
            updateUser(updatedUser);
            setIsEditingStatus(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-96 h-full bg-light-panel dark:bg-dark-panel border-r border-light-border dark:border-dark-border flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="h-[108px] bg-primary flex items-end p-5 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full">
                        <FaTimes className="text-xl" />
                    </button>
                    <h2 className="text-xl font-medium">Profile</h2>
                </div>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center py-8 bg-light-bg dark:bg-dark-bg">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-48 h-48 rounded-full overflow-hidden">
                        <img
                            src={user?.avatar || 'https://via.placeholder.com/200'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaCamera className="text-white text-2xl mb-2" />
                        <span className="text-white text-xs text-center px-4">
                            CHANGE PROFILE PHOTO
                        </span>
                    </div>
                    {loading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            {/* Fields */}
            <div className="flex-1 bg-white dark:bg-dark-panel">
                {/* Name */}
                <div className="p-4 px-8 shadow-sm">
                    <label className="text-sm text-primary font-medium block mb-3">Your Name</label>
                    <div className="flex items-center justify-between gap-2">
                        {isEditingName ? (
                            <div className="flex-1 flex items-center border-b-2 border-primary pb-1">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white"
                                    autoFocus
                                    maxLength={25}
                                />
                                <span className="text-xs text-gray-400 mr-2">{25 - name.length}</span>
                                <button onClick={handleSaveName}>
                                    <FaCheck className="text-gray-500 hover:text-primary cursor-pointer" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-900 dark:text-white flex-1">{user?.name}</p>
                                <button onClick={() => setIsEditingName(true)}>
                                    <FaPen className="text-gray-400 hover:text-primary" />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        This is not your username or pin. This name will be visible to your WhatsApp contacts.
                    </p>
                </div>

                {/* About (Status) */}
                <div className="p-4 px-8 mt-2 shadow-sm">
                    <label className="text-sm text-gray-500 dark:text-gray-400 font-medium block mb-3">About</label>
                    <div className="flex items-center justify-between gap-2">
                        {isEditingStatus ? (
                            <div className="flex-1 flex items-center border-b-2 border-primary pb-1">
                                <input
                                    type="text"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white"
                                    autoFocus
                                />
                                <button onClick={handleSaveStatus}>
                                    <FaCheck className="text-gray-500 hover:text-primary cursor-pointer" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-900 dark:text-white flex-1">{user?.about || 'Hi there! I am using ChatGo.'}</p>
                                <button onClick={() => setIsEditingStatus(true)}>
                                    <FaPen className="text-gray-400 hover:text-primary" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Phone (Read Only) */}
                <div className="p-4 px-8 mt-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400 font-medium block mb-3">Phone</label>
                    <p className="text-gray-900 dark:text-white">{user?.phone || '+91 877 784 7695'}</p>
                </div>

                {/* Logout */}
                <div className="p-4 px-8 mt-8 border-t border-light-border dark:border-dark-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-3 rounded-lg w-full transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
