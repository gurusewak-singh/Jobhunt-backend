import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    location: {
      type: String,
    },
    industry: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Company', CompanySchema);
