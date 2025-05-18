import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role ) { 
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Handle resume upload here if candidate uploads
    // if (req.file) updates.resume = req.file.path;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');

    res.status(200).json({ message: 'Profile updated.', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const getProfileCompletion = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id); 

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     let filledFields = 0;
//     const totalFields = 5; 

//     if (user.name) filledFields++;
//     if (user.email) filledFields++;
//     if (user.phone) filledFields++;
//     if (user.location) filledFields++;
//     if (user.bio) filledFields++;

//     const percentage = Math.round((filledFields / totalFields) * 100);

//     res.json({ percentage });
//   } catch (error) {
//     console.error(error);  
//     res.status(500).json({ message: "Error calculating profile completion" });
//   }
// };
