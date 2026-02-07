import express from 'express';
import { createStatus, getStatuses } from '../controllers/statusController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('media'), createStatus);
router.get('/', protect, getStatuses);

export default router;
