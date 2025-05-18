import Application from '../models/application.js';
import Job from '../models/job.js';

export const submitApplication = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply.' });
    }

    const { jobId, resumeId, coverLetter } = req.body;

    const application = await Application.create({
      candidate: req.user.id,
      job: jobId,
      resume: resumeId,
      coverLetter,
    });

    res.status(201).json({ message: 'Application submitted.', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (application.candidate.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    await Application.findByIdAndDelete(req.params.id); // ✅ fix

    res.status(200).json({ message: 'Application deleted.' });
  } catch (error) {
    console.error('Error deleting application:', error); // good logging
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
