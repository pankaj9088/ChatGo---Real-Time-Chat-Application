import express from 'express';
import {
    getMessages,
    sendMessage,
    markAsSeen,
    markChatAsSeen,
    getChatMedia,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/:chatId', protect, getMessages);
router.post('/', protect, upload.single('media'), sendMessage);
router.put('/:id/seen', protect, markAsSeen);
router.put('/chat/:chatId/seen', protect, markChatAsSeen);
router.get('/:chatId/media', protect, getChatMedia);

export default router;
