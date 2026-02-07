import api from './api';

export const updateProfile = async (data) => {
    // data can be { name, about, avatar (File) }
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.about) formData.append('about', data.about);
    // Handle status -> about mapping if needed
    if (data.status) formData.append('about', data.status);

    if (data.avatar) {
        formData.append('avatar', data.avatar);
    }

    // Pass headers for file upload
    const config = data.avatar ? {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    } : {};

    const response = await api.put('/api/users/profile', formData, config);
    return response.data;
};

export const searchUsers = async (query) => {
    const response = await api.get(`/api/users/search?search=${query}`);
    return response.data;
};
