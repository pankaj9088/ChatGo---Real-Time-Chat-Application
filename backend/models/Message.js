import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
            index: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            trim: true,
        },
        mediaUrl: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video', 'document', 'audio', null],
        },
        seen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster message retrieval
messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
