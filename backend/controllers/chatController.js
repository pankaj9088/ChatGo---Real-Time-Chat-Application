import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// @desc    Get all chats for user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            members: req.user._id,
        })
            .populate('members', 'name email avatar isOnline lastSeen')
            .populate('lastMessage')
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'senderId',
                    select: 'name',
                },
            })
            .sort({ updatedAt: -1 });

        res.json(chats);
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create or get one-to-one chat
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            isGroup: false,
            members: { $all: [req.user._id, userId], $size: 2 },
        })
            .populate('members', 'name email avatar isOnline lastSeen')
            .populate('lastMessage');

        if (chat) {
            return res.json(chat);
        }

        // Create new chat
        chat = await Chat.create({
            members: [req.user._id, userId],
            isGroup: false,
        });

        chat = await Chat.findById(chat._id)
            .populate('members', 'name email avatar isOnline lastSeen')
            .populate('lastMessage');

        res.status(201).json(chat);
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('members', 'name email avatar isOnline lastSeen')
            .populate('lastMessage');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is a member
        const isMember = chat.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Get chat by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
export const createGroupChat = async (req, res) => {
    try {
        const { name, members } = req.body;

        if (!name || !members || members.length < 2) {
            return res.status(400).json({
                message: 'Group name and at least 2 members are required'
            });
        }

        // Add creator to members
        const allMembers = [...new Set([req.user._id.toString(), ...members])];

        const chat = await Chat.create({
            groupName: name,
            isGroup: true,
            members: allMembers,
            groupAdmin: req.user._id,
        });

        const populatedChat = await Chat.findById(chat._id)
            .populate('members', 'name email avatar isOnline lastSeen')
            .populate('groupAdmin', 'name email avatar');

        res.status(201).json(populatedChat);
    } catch (error) {
        console.error('Create group chat error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
