import { createContext, useContext, useState, useEffect } from 'react';
import { login, signup, logout, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    if (userObj && userObj.token) {
                        try {
                            const userData = await getCurrentUser();
                            if (userData) {
                                setUser(userData);
                            } else {
                                throw new Error("Invalid token");
                            }
                        } catch (err) {
                            console.warn("Session expired or invalid, clearing storage.");
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    } else {
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error("Auth data corrupted, resetting:", error);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const handleLogin = async (email, password) => {
        const data = await login(email, password);
        setUser(data);
        return data;
    };

    const handleSignup = async (name, email, password, phone) => {
        const data = await signup(name, email, password, phone);
        setUser(data);
        return data;
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
