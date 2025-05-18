import express from 'express';
const router = express.Router();
import { createCompanyProfile, getAllCompanies, getCompanyById, updateCompanyProfile } from '../controllers/companyController.js';
import { verifyEmployer } from '../middleware/authMiddleware.js'; // Correctly importing as functions

// Define routes with correct function references
router.post('/', verifyEmployer, createCompanyProfile); // Use verifyEmployer and createCompanyProfile as functions
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', verifyEmployer, updateCompanyProfile);


export default router;
