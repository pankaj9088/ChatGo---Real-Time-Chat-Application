import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        // Verify user is member of chat
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const isMember = chat.members.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find({ chatId })
            .populate('senderId', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json(messages.reverse());
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        if (!chatId) {
            return res.status(400).json({ message: 'Chat ID is required' });
        }

        // Verify chat exists and user is member
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const isMember = chat.members.some(
            (member) => member.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        let mediaUrl = null;
        let mediaType = null;

        // Handle media upload
        if (req.file) {
            try {
                // Try Cloudinary upload first
                const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'auto';

                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'whatsapp-clone/messages',
                    resource_type: resourceType,
                });

                mediaUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload failed, falling back to local storage:', uploadError);

                // Fallback to local file serving
                // Construct the local URL: http://localhost:5000/uploads/filename
                const protocol = req.protocol;
                const host = req.get('host');
                mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
            }

            // Determine media type
            if (req.file.mimetype.startsWith('image')) {
                mediaType = 'image';
            } else if (req.file.mimetype.startsWith('video')) {
                mediaType = 'video';
            } else if (req.file.mimetype.startsWith('audio')) {
                mediaType = 'audio';
            } else {
                mediaType = 'document';
            }
        }

        // Create message
        const message = await Message.create({
            chatId,
            senderId: req.user._id,
            content: content || '',
            mediaUrl,
            mediaType,
        });

        // Update chat's last message
        chat.lastMessage = message._id;
        await chat.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'name avatar')
            .populate({
                path: 'chatId',
                select: 'members isGroup groupName'
            });

        // Emit socket event for real-time delivery
        if (req.io) {
            req.io.to(chatId).emit('message:receive', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark message as seen
// @route   PUT /api/messages/:id/seen
// @access  Private
export const markAsSeen = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only receiver can mark as seen
        if (message.senderId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot mark own message as seen' });
        }

        message.seen = true;
        message.seenAt = new Date();
        await message.save();

        res.json(message);
    } catch (error) {
        console.error('Mark as seen error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark all messages in chat as seen
// @route   PUT /api/messages/chat/:chatId/seen
// @access  Private
export const markChatAsSeen = async (req, res) => {
    try {
        const { chatId } = req.params;

        await Message.updateMany(
            {
                chatId,
                senderId: { $ne: req.user._id },
                seen: false,
            },
            {
                seen: true,
                seenAt: new Date(),
            }
        );

        res.json({ message: 'Messages marked as seen' });
    } catch (error) {
        console.error('Mark chat as seen error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get media messages for a chat
// @route   GET /api/messages/:chatId/media
// @access  Private
export const getChatMedia = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const isMember = chat.members.some(m => m.toString() === req.user._id.toString());
        if (!isMember) return res.status(403).json({ message: 'Access denied' });

        const messages = await Message.find({
            chatId,
            mediaUrl: { $ne: null }
        })
            .select('mediaUrl mediaType content createdAt')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
