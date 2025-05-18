import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['candidate', 'employer', 'admin'], default: 'candidate' },
  avatar: String,
  companyName: String,
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  location: String,
  bio: { type: String, maxlength: 500 },
  skills: [String],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
