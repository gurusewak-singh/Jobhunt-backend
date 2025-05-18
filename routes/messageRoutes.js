import express from 'express';
import { verifyUser } from '../middleware/authMiddleware.js';  // Apply verifyUser middleware
import { createMessage, getMessages, getMessageById, deleteMessage } from '../controllers/messageController.js';

const router = express.Router();

// Routes for message CRUD operations
router.post('/', verifyUser, createMessage); // Ensure user is authenticated
router.get('/', verifyUser, getMessages);  // Ensure user is authenticated
router.get('/:id', verifyUser, getMessageById); // Ensure user is authenticated
router.delete('/:id', verifyUser, deleteMessage); // Ensure user is authenticated

export default router;
