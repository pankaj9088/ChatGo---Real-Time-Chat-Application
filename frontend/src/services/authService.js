import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const signup = async (name, email, password, phone) => {
    const response = await api.post('/api/auth/signup', { name, email, password, phone });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('user');
    }
};

export const getCurrentUser = async () => {
    // Usually fetching profile to validate token
    try {
        const response = await api.get('/api/users/profile');
        return response.data;
    } catch (error) {
        return null;
    }
};
