import Status from '../models/Status.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new status
// @route   POST /api/status
// @access  Private
export const createStatus = async (req, res) => {
    try {
        const { caption } = req.body;
        let mediaUrl = null;
        let mediaType = 'text';

        // Handle text-only status (bg color?) - For now focus on media
        if (!req.file && !caption) {
            return res.status(400).json({ message: 'Content required' });
        }

        if (req.file) {
            try {
                // Try Cloudinary
                const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'auto';
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'whatsapp-clone/status',
                    resource_type: resourceType,
                });
                mediaUrl = result.secure_url;
                mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
            } catch (error) {
                console.error('Cloudinary upload failed, falling back to local:', error);
                const protocol = req.protocol;
                const host = req.get('host');
                mediaUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
                mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
            }
        }

        const status = await Status.create({
            user: req.user._id,
            mediaUrl,
            mediaType,
            caption
        });

        const populatedStatus = await Status.findById(status._id).populate('user', 'name avatar');
        res.status(201).json(populatedStatus);
    } catch (error) {
        console.error('Create status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all active statuses grouped by user
// @route   GET /api/status
// @access  Private
export const getStatuses = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find statuses not expired (though Mongo TTL handles deletion, query helps precision)
        // Also we want to fetch user data
        const statuses = await Status.find({
            createdAt: { $gt: twentyFourHoursAgo }
        })
            .sort({ createdAt: 1 }) // Oldest first (chronological for viewing)
            .populate('user', 'name avatar');

        // Group by User
        const grouped = {};

        statuses.forEach(status => {
            const userId = status.user._id.toString();
            if (!grouped[userId]) {
                grouped[userId] = {
                    user: status.user,
                    statuses: []
                };
            }
            grouped[userId].statuses.push(status);
        });

        // Convert to array
        const result = Object.values(grouped);

        // Move "My Status" to top if exists, else standard sort
        const myId = req.user._id.toString();
        const myStatusIndex = result.findIndex(g => g.user._id.toString() === myId);

        if (myStatusIndex > -1) {
            const myStatus = result.splice(myStatusIndex, 1)[0];
            result.unshift(myStatus);
        }

        res.json(result);
    } catch (error) {
        console.error('Get statuses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
