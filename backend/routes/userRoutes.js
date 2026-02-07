import express from 'express';
import {
    getProfile,
    updateProfile,
    searchUsers,
    getAllUsers,
    getUserById,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/search', protect, searchUsers);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);

export default router;

