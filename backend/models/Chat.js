import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        isGroup: {
            type: Boolean,
            default: false,
        },
        groupName: {
            type: String,
            trim: true,
        },
        groupAvatar: {
            type: String,
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
chatSchema.index({ members: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
