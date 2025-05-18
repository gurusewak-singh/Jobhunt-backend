// backend/controllers/resumeController.js
import mongoose from 'mongoose';
import Resume from '../models/resume.js';
import uploadResume from '../middleware/fileUpload.js';
import fs from 'fs';

export const handleResumeUpload = (req, res) => {
  uploadResume(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const resume = new Resume({
        user: req.user.id,
        fileUrl: req.file.path,      // path where file is saved
        originalName: req.file.originalname,
      });

      await resume.save();

      res.status(201).json({ message: 'Resume uploaded successfully', resume });
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(500).json({ message: 'Error saving resume to the database', error: error.message });
    }
  });
};

export const deleteResume = async (req, res) => {
  let { userId } = req.params;

  if (userId === 'me') {
    userId = req.user.id;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (fs.existsSync(resume.fileUrl)) {
      fs.unlinkSync(resume.fileUrl);
    }
    await resume.remove();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
};

export const getResumeDetails = async (req, res) => {
  let { userId } = req.params;

  // If 'me', replace with logged-in user's id
  if (userId === 'me') {
    userId = req.user.id;
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Error fetching resume details' });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json({ resume });
  } catch (error) {
    console.error('Error fetching your resume:', error);
    res.status(500).json({ message: 'Error fetching your resume' });
  }
};
