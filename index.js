import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/db.js';
import aiRoutes from './routes/aiRoutes.js';
import corsMiddleware from './middleware/corsMiddleware.js';


// Import route files for testing
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import messageRoutes from './routes/messageRoutes.js'; // Added message routes
import resumeRoutes from './routes/resumeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
// import profileRoutes from './routes/profileRoutes.js';

// Import error handler
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'https://jobhunt-frontend-rwk4.vercel.app/',  // Change to your frontend's address 
  // changed http://localhost:5173
  credentials: true,  // Enable cookies to be sent
}));

// Connect to the database
connectDB();

// Test Routes
app.use('/api/users', userRoutes);          // User-related routes (login, register, profile)
app.use('/api/companies', companyRoutes);    // Company-related routes (profile creation, update)
app.use('/api/jobs', jobRoutes);             // Job-related routes (post, get jobs)
app.use('/api/messages', messageRoutes);     // Messaging-related routes (added message routes)
app.use('/api/resumes', resumeRoutes);       // Resume-related routes
app.use('/api/applications', applicationRoutes);  // Application-related routes
app.use('/api/bookmarks', bookmarkRoutes);   // Bookmark-related routes
app.use('/api/categories', categoryRoutes);  // Category-related routes
app.use('/api/ai', aiRoutes);               // AI-related routes
// app.use('/api/profile', profileRoutes);


app.use(corsMiddleware);


// Error Handling Middleware (to catch unexpected errors)
app.use(errorHandler);

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
