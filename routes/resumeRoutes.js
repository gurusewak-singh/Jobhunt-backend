import express from 'express';
import { handleResumeUpload, deleteResume, getResumeDetails,getMyResume } from '../controllers/resumeController.js';
import { verifyCandidate } from '../middleware/authMiddleware.js'; // Correct now

const router = express.Router();

// Define routes
router.post('/upload', verifyCandidate, handleResumeUpload);
router.delete('/:userId', verifyCandidate, deleteResume);
router.get('/:userId', verifyCandidate, getResumeDetails);
router.get('/me', verifyCandidate, getMyResume);

export default router;
