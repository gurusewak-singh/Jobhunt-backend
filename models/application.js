import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field: get application count for a job
ApplicationSchema.virtual('jobApplications', {
  ref: 'Job',
  localField: 'job',
  foreignField: '_id',
  count: true,
});

export default mongoose.model('Application', ApplicationSchema);
