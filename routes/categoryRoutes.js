import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware.verifyEmployer, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

export default router;
