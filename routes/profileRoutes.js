// routes/profileRoutes.js
import express from 'express';
import { getProfileCompletion } from '../controllers/profileController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/completion', verifyToken, getProfileCompletion);

export default router;
