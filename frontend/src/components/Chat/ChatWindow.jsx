import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getMessages, markChatAsSeen } from '../../services/messageService';
import { formatLastSeen } from '../../utils/formatTime';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ChatMenu from './ChatMenu';
import ThemeModal from './ThemeModal';
import ChatMediaSidebar from './ChatMediaSidebar';
import { FaVideo, FaPhone, FaEllipsisV, FaArrowLeft } from 'react-icons/fa';

const ChatWindow = ({ chat, onOpenSidebar, onStartCall }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(null);
    const [showMediaSidebar, setShowMediaSidebar] = useState(false);

    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const { socket, isUserOnline } = useSocket();

    // Updated to use chat.users instead of chat.members
    const otherMember = chat.users?.find((member) => member._id !== user._id) || chat.users?.[0] || chat.members?.find((member) => member._id !== user._id);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessages(chat._id);
                setMessages(data);
                scrollToBottom();
                markMessagesAsSeen();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };

        if (chat._id) {
            fetchMessages();
        }
    }, [chat._id]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('chat:join', chat._id);

        const handleNewMessage = (newMessage) => {
            // Check if message belongs to current chat
            // newMessage.chat can be populated object or ID string
            const msgChatId = newMessage.chat?._id || newMessage.chat || newMessage.chatId;
            if (msgChatId === chat._id) {
                setMessages((prev) => [...prev, newMessage]);
                scrollToBottom();
                markMessagesAsSeen();
            }
        };

        socket.on('message:receive', handleNewMessage);

        return () => {
            socket.emit('chat:leave', chat._id);
            socket.off('message:receive', handleNewMessage);
        };
    }, [chat._id, socket]);

    // Socket Setup for Typing Indicators ONLY
    useEffect(() => {
        if (!socket) return;

        socket.on('typing:start', ({ userId, userName }) => {
            if (userId !== user._id) {
                setTypingUsers((prev) => new Set([...prev, userName]));
            }
        });

        socket.on('typing:stop', ({ userId }) => {
            setTypingUsers((prev) => {
                const updated = new Set(prev);
                updated.delete(userId);
                return updated;
            });
        });

        return () => {
            socket.off('typing:start');
            socket.off('typing:stop');
        };
    }, [socket]);

    const markMessagesAsSeen = async () => {
        try {
            await markChatAsSeen(chat._id);
        } catch (error) {
            console.error('Error marking messages as seen:', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = () => {
        // Firestore listener handles the UI update immediately (Latency Compensation)
        scrollToBottom();
    };

    const handleMenuAction = (action) => {
        switch (action) {
            case 'View contact':
                alert(`View contact: ${otherMember?.name}`);
                break;
            case 'Search':
                alert('Search messages functionality coming soon!');
                break;
            case 'Media, links, and docs':
                setShowMediaSidebar(true);
                break;
            case 'Mute notifications':
                alert('Notifications muted');
                break;
            case 'Disappearing messages':
                alert('Disappearing messages turned off');
                break;
            case 'Chat theme':
                setShowThemeModal(true);
                break;
            case 'Clear chat':
                setMessages([]);
                break;
            case 'Block':
                if (window.confirm(`Block ${otherMember?.name}?`)) {
                    alert('User blocked');
                }
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-light-panel dark:bg-dark-panel">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden bg-light-panel dark:bg-dark-panel">
            <div className="flex-1 flex flex-col h-full bg-light-panel dark:bg-dark-panel relative min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 bg-light-panel dark:bg-dark-panel border-b border-light-border dark:border-dark-border z-10">
                    <button
                        onClick={onOpenSidebar}
                        className="lg:hidden p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                    >
                        <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="relative">
                        <img
                            src={otherMember?.avatar || 'https://via.placeholder.com/40'}
                            alt={otherMember?.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {isUserOnline(otherMember?._id) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-panel"></div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowMediaSidebar(true)}>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {otherMember?.name || 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isUserOnline(otherMember?._id)
                                ? 'Online'
                                : formatLastSeen(otherMember?.lastSeen)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 relative">
                        <button
                            onClick={() => onStartCall(otherMember._id, otherMember)}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors hidden sm:block"
                            title="Video Call"
                        >
                            <FaVideo className="text-xl text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors hidden sm:block"
                            title="Voice Call"
                        >
                            <FaPhone className="text-xl text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
                        >
                            <FaEllipsisV className="text-xl text-gray-600 dark:text-gray-300" />
                        </button>
                        <ChatMenu
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            onAction={handleMenuAction}
                        />
                    </div>
                </div>

                {/* Messages */}
                <div
                    className={`flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin ${!currentTheme ? 'bg-[#e5ddd5] dark:bg-[#0b141a]' : ''}`}
                    style={currentTheme ? {
                        backgroundColor: document.documentElement.classList.contains('dark') ? currentTheme.darkColor : currentTheme.color
                    } : {}}
                >
                    {messages.map((message) => (
                        <Message key={message._id} message={message} />
                    ))}

                    {typingUsers.size > 0 && <TypingIndicator users={Array.from(typingUsers)} />}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <MessageInput chatId={chat._id} onMessageSent={handleSendMessage} />
            </div>

            {/* Media Sidebar */}
            {showMediaSidebar && (
                <ChatMediaSidebar
                    chat={chat}
                    onClose={() => setShowMediaSidebar(false)}
                />
            )}

            <ThemeModal
                isOpen={showThemeModal}
                onClose={() => setShowThemeModal(false)}
                onSelectTheme={setCurrentTheme}
            />
        </div>
    );
};

export default ChatWindow;
