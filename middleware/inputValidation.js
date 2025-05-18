const { body, validationResult } = require('express-validator');

// Validate user registration input
const validateUser = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validate job posting input
const validateJob = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('location').notEmpty().withMessage('Job location is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validate job application input
const validateApplication = [
  body('jobId').isMongoId().withMessage('Job ID is invalid'),
  body('candidateDetails').notEmpty().withMessage('Candidate details are required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
export { validateUser, validateJob, validateApplication };

