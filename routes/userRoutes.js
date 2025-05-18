// user.route.js
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount
} from '../controllers/userController.js';

import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyUser, getUserProfile);
router.put('/me', verifyUser, updateUserProfile);
router.delete('/me', verifyUser, deleteUserAccount);
// router.get('/profile/completion', verifyUser, getProfileCompletion);

export default router;
