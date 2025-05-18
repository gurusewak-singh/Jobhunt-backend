import express from 'express';
const router = express.Router();
import * as bookmarkController from '../controllers/bookmarkController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware.verifyUser, bookmarkController.bookmarkJob); // corrected
router.delete('/:jobId', authMiddleware.verifyUser, bookmarkController.removeBookmark); // corrected
router.get('/', authMiddleware.verifyUser, bookmarkController.getUserBookmarks); // corrected

export default router;
