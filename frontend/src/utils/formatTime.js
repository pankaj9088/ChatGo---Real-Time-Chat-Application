import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const formatMessageTime = (date) => {
    if (!date) return '';

    const messageDate = new Date(date);
    return format(messageDate, 'HH:mm');
};

export const formatChatTime = (date) => {
    if (!date) return '';

    const chatDate = new Date(date);

    if (isToday(chatDate)) {
        return format(chatDate, 'HH:mm');
    }

    if (isYesterday(chatDate)) {
        return 'Yesterday';
    }

    return format(chatDate, 'dd/MM/yyyy');
};

export const formatLastSeen = (date) => {
    if (!date) return 'Last seen recently';

    const lastSeenDate = new Date(date);

    if (isToday(lastSeenDate)) {
        return `Last seen today at ${format(lastSeenDate, 'HH:mm')}`;
    }

    if (isYesterday(lastSeenDate)) {
        return `Last seen yesterday at ${format(lastSeenDate, 'HH:mm')}`;
    }

    return `Last seen ${format(lastSeenDate, 'dd/MM/yyyy')} at ${format(lastSeenDate, 'HH:mm')}`;
};

export const formatRelativeTime = (date) => {
    if (!date) return '';

    return formatDistanceToNow(new Date(date), { addSuffix: true });
};
