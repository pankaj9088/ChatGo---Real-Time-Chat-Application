import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video', 'text'],
            default: 'image',
        },
        caption: {
            type: String,
            trim: true,
        },
        viewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: '24h' }, // Auto-delete after 24 hours
        },
    },
    {
        timestamps: true,
    }
);

const Status = mongoose.model('Status', statusSchema);

export default Status;
