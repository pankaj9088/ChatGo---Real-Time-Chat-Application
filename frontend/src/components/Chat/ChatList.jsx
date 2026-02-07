import { useState, useEffect } from 'react';
import { getChats, searchUsers } from '../../services/chatService';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { formatChatTime } from '../../utils/formatTime';
import { FaSearch, FaPlus, FaEllipsisV, FaCommentAlt, FaCircleNotch, FaBars } from 'react-icons/fa';

const ChatList = ({ onSelectChat, selectedChatId, onOpenProfile, onOpenStatus, onOpenDrawer }) => {
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const { isUserOnline } = useSocket();
    const { user } = useAuth();

    const { socket } = useSocket();

    const fetchChats = async () => {
        try {
            const data = await getChats();
            setChats(data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('chat:new', (newChat) => {
            setChats((prev) => [newChat, ...prev]);
        });

        // Update latest message
        socket.on('message:receive', (newMessage) => {
            setChats(prev => prev.map(c =>
                c._id === (newMessage.chat?._id || newMessage.chat || newMessage.chatId)
                    ? { ...c, latestMessage: newMessage, updatedAt: new Date() } // Update latest msg
                    : c
            ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        });

        return () => {
            socket.off('chat:new');
            socket.off('message:receive');
        };
    }, [socket]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            setIsSearching(true);
            try {
                const results = await searchUsers(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    const getOtherMember = (chat) => {
        // Updated to use chat.users instead of chat.members
        // And chat.users includes SELF + OTHERS.
        return chat.users?.find((member) => member._id !== user._id) || chat.users?.[0] || chat.members?.find((member) => member._id !== user._id);
    };

    const getChatName = (chat) => {
        if (chat.isGroupChat) {
            return chat.chatName;
        }
        const otherMember = getOtherMember(chat);
        return otherMember?.name || 'Unknown';
    };

    const getChatAvatar = (chat) => {
        if (chat.isGroupChat) {
            return 'https://via.placeholder.com/50'; // Group Avatar Placeholder
        }
        const otherMember = getOtherMember(chat);
        return otherMember?.avatar || 'https://via.placeholder.com/50';
    };

    const getLastMessageText = (chat) => {
        if (!chat.latestMessage) return 'No messages yet';
        const message = chat.latestMessage;
        if (message.mediaUrl) {
            return `📎 ${message.mediaType || 'Media'}`;
        }
        return message.content || 'Start a conversation';
    };

    const isOnline = (chat) => {
        if (chat.isGroupChat) return false;
        const otherMember = getOtherMember(chat);
        return otherMember ? isUserOnline(otherMember._id) : false;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-light-panel dark:bg-dark-panel">
            {/* Header */}
            <div className="bg-light-panel dark:bg-dark-panel border-b border-light-border dark:border-dark-border">
                {/* User Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-light-bg dark:bg-dark-panel/50">
                    <div className="flex items-center gap-4">
                        <button onClick={onOpenDrawer} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10">
                            <FaBars className="text-gray-600 dark:text-gray-300 text-lg" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">ChatGo</h1>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <button title="Status" onClick={onOpenStatus}>
                            <FaCircleNotch className="text-lg hover:text-gray-800 dark:hover:text-white transition-colors" />
                        </button>
                        <button title="New Chat">
                            <FaCommentAlt className="text-lg hover:text-gray-800 dark:hover:text-white transition-colors" />
                        </button>
                        <button title="Menu">
                            <FaEllipsisV className="text-lg hover:text-gray-800 dark:hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-2">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search or start new chat"
                            className="w-full pl-10 pr-4 py-1.5 bg-light-bg dark:bg-dark-bg border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {isSearching ? (
                    // Search Results
                    <div>
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => {
                                        onSelectChat(null, user);
                                        setSearchQuery('');
                                        setIsSearching(false);
                                    }}
                                    className="flex items-center gap-3 p-4 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer border-b border-light-border dark:border-dark-border"
                                >
                                    <div className="relative">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {user.about || "Available"}
                                        </p>
                                    </div>
                                    <FaPlus className="text-primary" />
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No users found
                            </div>
                        )}
                    </div>
                ) : (
                    // Existing Chats
                    <div>
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <div
                                    key={chat._id}
                                    onClick={() => onSelectChat(chat)}
                                    className={`flex items-center gap-3 p-4 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer border-b border-light-border dark:border-dark-border transition-colors ${selectedChatId === chat._id ? 'bg-light-hover dark:bg-dark-hover' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={getChatAvatar(chat)}
                                            alt={getChatName(chat)}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        {isOnline(chat) && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-panel"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {getChatName(chat)}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                {formatChatTime(chat.updatedAt?.toDate ? chat.updatedAt.toDate() : chat.updatedAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {getLastMessageText(chat)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="mb-2">No chats yet</p>
                                <p className="text-sm">Search for users to start chatting</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
