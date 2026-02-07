import { useState, useRef } from 'react';
import { FaTimes, FaSearch, FaCheck, FaCamera } from 'react-icons/fa';
import { searchUsers, createGroupChat } from '../../services/chatService';

const NewGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            setLoading(true);
            try {
                const results = await searchUsers(query);
                // Filter out already selected users from results to avoid duplication visual
                // Actually better to show them as checked
                setSearchResults(results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleUser = (user) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) return;

        setCreating(true);
        try {
            const memberIds = selectedUsers.map(u => u._id);
            const newGroup = await createGroupChat(groupName, memberIds);
            onGroupCreated(newGroup);
            onClose();
            // Reset
            setGroupName('');
            setSelectedUsers([]);
            setSearchQuery('');
        } catch (error) {
            console.error(error);
            alert('Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-dark-panel w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center gap-4">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                        <FaTimes className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Group</h2>
                </div>

                {/* Group Details */}
                <div className="p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                        <FaCamera />
                    </div>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group Name"
                        className="flex-1 bg-transparent border-b-2 border-primary py-2 outline-none text-gray-900 dark:text-white"
                        autoFocus
                    />
                </div>

                {/* Search */}
                <div className="px-4 pb-2">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Add Members"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-bg rounded-lg focus:outline-none text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Selection Chips */}
                {selectedUsers.length > 0 && (
                    <div className="px-4 py-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {selectedUsers.map(u => (
                            <div key={u._id} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                <span>{u.name}</span>
                                <button onClick={() => toggleUser(u)} className="hover:text-red-500"><FaTimes size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="text-center p-4 text-gray-500">Loading...</div>
                    ) : (
                        <div>
                            {searchResults.length > 0 ? (
                                searchResults.map(user => {
                                    const isSelected = selectedUsers.some(u => u._id === user._id);
                                    return (
                                        <div
                                            key={user._id}
                                            onClick={() => toggleUser(user)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer"
                                        >
                                            <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            {isSelected && <FaCheck className="text-primary" />}
                                        </div>
                                    );
                                })
                            ) : (
                                searchQuery && <div className="text-center p-4 text-gray-500">No users found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-light-border dark:border-dark-border flex justify-end">
                    <button
                        onClick={handleCreateGroup}
                        disabled={!groupName || selectedUsers.length === 0 || creating}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {creating ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewGroupModal;
