const users = new Map(); // Map of userId -> socketId

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);

        // User joins
        socket.on('user:join', (userId) => {
            try {
                users.set(userId, socket.id);
                socket.userId = userId;

                // Notify all users about online status (Optional, now handled by Firestore)
                io.emit('user:online', userId);

                console.log(`User ${userId} joined with socket ${socket.id}`);
            } catch (error) {
                console.error('User join error:', error);
            }
        });

        // Join chat room
        socket.on('chat:join', (chatId) => {
            socket.join(chatId);
            console.log(`Socket ${socket.id} joined chat ${chatId}`);
        });

        // Leave chat room
        socket.on('chat:leave', (chatId) => {
            socket.leave(chatId);
            console.log(`Socket ${socket.id} left chat ${chatId}`);
        });

        // Send message (Relay only, persistence is Firestore)
        socket.on('message:send', (data) => {
            try {
                const { chatId, message } = data;
                // Broadcast message to chat room (Others rely on Firestore, but this can give instant feedback if listening)
                // However, since we use Firestore listeners in frontend, we might not need this.
                // Keeping it harmless.
                io.to(chatId).emit('message:receive', message);
                console.log(`Message relayed to chat ${chatId}`);
            } catch (error) {
                console.error('Send message error:', error);
            }
        });

        // Typing indicator
        socket.on('typing:start', (data) => {
            const { chatId, userId, userName } = data;
            socket.to(chatId).emit('typing:start', { userId, userName });
        });

        socket.on('typing:stop', (data) => {
            const { chatId, userId } = data;
            socket.to(chatId).emit('typing:stop', { userId });
        });

        // Message seen (Relay only)
        socket.on('message:seen', (data) => {
            const { messageId, chatId } = data;
            io.to(chatId).emit('message:seen', { messageId });
        });

        // WebRTC Signaling for Video Calls
        socket.on('call:initiate', (data) => {
            const { to, offer, from } = data;
            const recipientSocket = users.get(to);

            if (recipientSocket) {
                io.to(recipientSocket).emit('call:incoming', {
                    from,
                    offer,
                });
            } else {
                console.log(`Call failed: User ${to} not found in active sockets.`);
            }
        });

        socket.on('call:answer', (data) => {
            const { to, answer } = data;
            const callerSocket = users.get(to);

            if (callerSocket) {
                io.to(callerSocket).emit('call:answered', { answer });
            }
        });

        socket.on('call:ice-candidate', (data) => {
            const { to, candidate } = data;
            const recipientSocket = users.get(to);

            if (recipientSocket) {
                io.to(recipientSocket).emit('call:ice-candidate', { candidate });
            }
        });

        socket.on('call:end', (data) => {
            const { to } = data;
            const recipientSocket = users.get(to);

            if (recipientSocket) {
                io.to(recipientSocket).emit('call:ended');
            }
        });

        socket.on('call:reject', (data) => {
            const { to } = data;
            const callerSocket = users.get(to);

            if (callerSocket) {
                io.to(callerSocket).emit('call:rejected');
            }
        });

        // User disconnect
        socket.on('disconnect', () => {
            try {
                const userId = socket.userId;

                if (userId) {
                    users.delete(userId);
                    io.emit('user:offline', userId);
                    console.log(`User ${userId} disconnected`);
                }
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        });
    });
};
