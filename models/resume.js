import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {             // path to the uploaded file on server
      type: String,
      required: [true, 'Resume file URL is required'],
    },
    originalName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Resume', ResumeSchema);
