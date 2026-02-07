import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { sendMessage } from '../../services/messageService';
import EmojiPicker from 'emoji-picker-react';
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes } from 'react-icons/fa';

const MessageInput = ({ chatId, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleTyping = (value) => {
        setMessage(value);

        if (!socket) return;

        if (!isTyping && value.trim()) {
            setIsTyping(true);
            socket.emit('typing:start', {
                chatId,
                userId: user._id,
                userName: user.name,
            });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('typing:stop', {
                chatId,
                userId: user._id,
            });
        }, 1000);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() && !selectedFile) return;

        setSending(true);

        try {
            let type = 'text';
            if (selectedFile) {
                if (selectedFile.type.startsWith('image/')) type = 'image';
                else if (selectedFile.type.startsWith('video/')) type = 'video';
                else type = 'file';
            }

            const sentMessage = await sendMessage(chatId, message, type, selectedFile);

            // Emit socket event
            if (socket) {
                socket.emit('message:send', {
                    chatId,
                    message: sentMessage,
                });
            }

            onMessageSent(sentMessage);
            setMessage('');
            handleRemoveFile();
            setShowEmojiPicker(false);

            // Stop typing indicator
            if (isTyping) {
                setIsTyping(false);
                socket.emit('typing:stop', {
                    chatId,
                    userId: user._id,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="border-t border-light-border dark:border-dark-border bg-light-panel dark:bg-dark-panel p-4">
            {/* File Preview */}
            {selectedFile && (
                <div className="mb-3 p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
                            ) : (
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                    📄
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveFile}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                        >
                            <FaTimes className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 z-50">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    />
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
                >
                    <FaSmile className="text-2xl text-gray-600 dark:text-gray-400" />
                </button>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
                >
                    <FaPaperclip className="text-2xl text-gray-600 dark:text-gray-400" />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />

                <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                <button
                    type="submit"
                    disabled={sending || (!message.trim() && !selectedFile)}
                    className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaPaperPlane className="text-xl" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
