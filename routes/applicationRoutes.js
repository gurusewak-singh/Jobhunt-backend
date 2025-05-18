import express from 'express';
const router = express.Router();
import * as applicationController from '../controllers/applicationController.js';
import { verifyCandidate, verifyUser } from '../middleware/authMiddleware.js';

// Correctly use the exported functions
router.post('/', verifyCandidate, applicationController.submitApplication);
router.get('/', verifyUser, applicationController.getApplicationsByUser); // Fixed function name
router.get('/job/:jobId', verifyUser, applicationController.getApplicationsByJob); // Fixed function name
router.delete('/:id', verifyUser, applicationController.deleteApplication);

export default router;
