import express from 'express';
import {
    getChats,
    createChat,
    getChatById,
    createGroupChat,
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.post('/group', protect, createGroupChat);
router.get('/:id', protect, getChatById);

export default router;
