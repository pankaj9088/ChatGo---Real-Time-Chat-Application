import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                status: user.status,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.name = req.body.name || user.name;
        user.status = req.body.status || user.status;
        user.phone = req.body.phone || user.phone;

        // Handle avatar upload
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'whatsapp-clone/avatars',
                    width: 200,
                    height: 200,
                    crop: 'fill',
                });
                user.avatar = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload failed, falling back to local storage:', uploadError);
                // Fallback to local file serving
                const protocol = req.protocol;
                const host = req.get('host');
                user.avatar = `${protocol}://${host}/uploads/${req.file.filename}`;
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            status: updatedUser.status,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search users
// @route   GET /api/users/search?query=
// @access  Private
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const users = await User.find({
            _id: { $ne: req.user._id }, // Exclude current user
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
            ],
        })
            .select('name email phone avatar status isOnline lastSeen')
            .limit(20);

        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users (for contacts)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('name email phone avatar status isOnline lastSeen')
            .sort({ name: 1 });

        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name email phone avatar status isOnline lastSeen');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

