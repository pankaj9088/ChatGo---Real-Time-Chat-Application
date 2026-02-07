import { useAuth } from '../../context/AuthContext';
import { formatMessageTime } from '../../utils/formatTime';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';

const Message = ({ message }) => {
    const { user } = useAuth();
    const isSent = message.senderId._id === user._id || message.senderId === user._id;

    return (
        <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
                className={`message-bubble ${isSent ? 'message-sent' : 'message-received'
                    }`}
            >
                {/* Media */}
                {message.mediaUrl && (
                    <div className="mb-2">
                        {message.mediaType === 'image' && (
                            <img
                                src={message.mediaUrl}
                                alt="Shared image"
                                className="max-w-[200px] rounded-lg"
                            />
                        )}
                        {message.mediaType === 'video' && (
                            <video
                                src={message.mediaUrl}
                                controls
                                className="max-w-[200px] rounded-lg"
                            />
                        )}
                        {message.mediaType === 'document' && (
                            <a
                                href={message.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                📄 Document
                            </a>
                        )}
                    </div>
                )}

                {/* Text Content */}
                {message.content && (
                    <p className="text-gray-900 dark:text-gray-100 break-words whitespace-pre-wrap">
                        {message.content}
                    </p>
                )}

                {/* Time and Status */}
                <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                        {formatMessageTime(message.createdAt)}
                    </span>
                    {isSent && (
                        <span className="text-gray-600 dark:text-gray-400">
                            {message.seen ? (
                                <FaCheckDouble className="text-blue-500 text-xs" />
                            ) : (
                                <FaCheck className="text-xs" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
