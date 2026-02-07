import api from './api';

export const createStatus = async (data) => {
    // data is { media: File, caption?: string }
    const formData = new FormData();
    if (data.media) {
        formData.append('media', data.media);
    }
    if (data.caption) {
        formData.append('caption', data.caption);
    }

    const response = await api.post('/api/status', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getStatuses = async () => {
    const response = await api.get('/api/status');
    return response.data;
};
