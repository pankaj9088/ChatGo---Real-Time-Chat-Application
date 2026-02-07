import api from './api';

export const getChats = async () => {
    const response = await api.get('/api/chats');
    return response.data;
};

export const createChat = async (userId) => {
    const response = await api.post('/api/chats', { userId });
    return response.data;
};

export const createGroupChat = async (name, users) => {
    const response = await api.post('/api/chats/group', {
        name,
        members: users, // Send array directly, key must be 'members'
    });
    return response.data;
};

export const searchUsers = async (search) => {
    const response = await api.get(`/api/users/search?query=${search}`);
    return response.data;
};

export const getChatById = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}`);
    return response.data;
};
