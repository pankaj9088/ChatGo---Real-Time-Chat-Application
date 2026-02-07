import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const newSocket = io(SOCKET_URL, {
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                newSocket.emit('user:join', user._id);
            });

            newSocket.on('user:online', (userId) => {
                setOnlineUsers((prev) => new Set([...prev, userId]));
            });

            newSocket.on('user:offline', (userId) => {
                setOnlineUsers((prev) => {
                    const updated = new Set(prev);
                    updated.delete(userId);
                    return updated;
                });
            });

            newSocket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [user?._id]);

    const value = {
        socket,
        onlineUsers,
        isUserOnline: (userId) => onlineUsers.has(userId),
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
