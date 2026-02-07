const TypingIndicator = ({ users }) => {
    if (users.length === 0) return null;

    const displayText =
        users.length === 1
            ? `${users[0]} is typing`
            : users.length === 2
                ? `${users[0]} and ${users[1]} are typing`
                : `${users[0]} and ${users.length - 1} others are typing`;

    return (
        <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex gap-1">
                <span className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"></span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{displayText}</span>
        </div>
    );
};

export default TypingIndicator;
