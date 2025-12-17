import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String, // later can be S3 / Cloudinary
    },

    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate applications
 * One user can apply only once per job
 */
JobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const JobApplication = mongoose.model(
  'JobApplication',
  JobApplicationSchema
);
