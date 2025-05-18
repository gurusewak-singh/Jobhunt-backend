import Company from '../models/company.js';

// Create a company profile
export const createCompanyProfile = async (req, res) => {
  try {
    const { name, description, website, logo, location, industry } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ user: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a company profile.' });
    }

    const newCompany = new Company({
      user: req.user._id,
      name,
      description,
      website,
      logo,
      location,
      industry,
    });

    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve companies.' });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve the company.' });
  }
};

// Update company profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const { name, description, website, logo, location, industry } = req.body;
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        website,
        logo,
        location,
        industry,
      },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: 'Error updating company profile' });
  }
};

