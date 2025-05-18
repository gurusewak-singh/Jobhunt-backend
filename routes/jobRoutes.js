import express from 'express';
const router = express.Router();

// Controllers
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCompany,
  searchJobTitles
} from '../controllers/jobController.js';

// Middleware
import { verifyEmployer } from '../middleware/authMiddleware.js';

/**
 * @route   POST /api/jobs
 * @desc    Create a new job post (Employer only)
 * @access  Private
 */
router.post('/', verifyEmployer, createJob);

/**
 * @route   GET /api/jobs
 * @desc    Get all job listings (with pagination, category & search filters)
 * @access  Public
 */
router.get('/', getJobs);

/**
 * @route   GET /api/jobs/search/suggestions
 * @desc    Get job title suggestions for autocomplete
 * @access  Public
 */
router.get('/search/suggestions', searchJobTitles);

/**
 * @route   GET /api/jobs/company/:companyId
 * @desc    Get all jobs posted by a company (by companyId)
 * @access  Public
 */
router.get('/company/:companyId', getJobsByCompany);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get single job by ID
 * @access  Public
 */
router.get('/:id', getJobById);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update a job post (Employer only)
 * @access  Private
 */
router.put('/:id', verifyEmployer, updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job post (Employer only)
 * @access  Private
 */
router.delete('/:id', verifyEmployer, deleteJob);

export default router;
