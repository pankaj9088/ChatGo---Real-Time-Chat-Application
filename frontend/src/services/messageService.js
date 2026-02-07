import api from './api';

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/messages/${chatId}`);
    return response.data;
};

export const sendMessage = async (chatId, content, type = 'text', file = null) => {
    // If file exists, use FormData
    if (file) {
        const formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('content', content || '');
        formData.append('type', type);
        formData.append('media', file); // 'media' matches upload.single('media')

        const response = await api.post('/api/messages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await api.post('/api/messages', {
            chatId,
            content,
            type
        });
        return response.data;
    }
};

export const markChatAsSeen = async (chatId) => {
    const response = await api.put(`/api/messages/chat/${chatId}/seen`);
    return response.data;
};

export const getChatMedia = async (chatId) => {
    const response = await api.get(`/api/messages/${chatId}/media`);
    return response.data;
};
