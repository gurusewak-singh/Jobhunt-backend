import Job from '../models/job.js';

// ✅ Create Job
export const createJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Only employers can post jobs.' });
    }

    const {
      title,
      description,
      location,
      employmentType,
      category,
      company, // this is companyId
    } = req.body;

    if (!title || !description || !location || !employmentType || !category || !company) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    const job = await Job.create({
      title,
      description,
      location,
      employmentType,
      category,
      company,           // 🟢 companyId reference
      postedBy: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Job created successfully.', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this job.' });
    }

    // Whitelist allowed fields to update
    const allowedUpdates = ['title', 'description', 'location', 'employmentType', 'category', 'company'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Job updated successfully.', updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this job.' });
    }

    await job.remove();
    res.status(200).json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Get All Jobs (with pagination, category, search)
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search
    } = req.query;

    const query = {};

    if (category) {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .populate('company', 'name')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      jobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Get Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('company', 'name');

    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Get Jobs By Company (companyId from Company model)
export const getJobsByCompany = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.companyId })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email')
      .populate('company', 'name');

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ success: false, message: 'No jobs found for this company.' });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// ✅ Search Job Titles (for autocomplete)
export const searchJobTitles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required.' });

    const jobs = await Job.find({ title: new RegExp(query, 'i') })
      .limit(10)
      .select('title');

    const suggestions = [...new Set(jobs.map(job => job.title))];
    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};
