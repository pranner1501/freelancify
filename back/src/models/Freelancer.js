// server/src/models/Freelancer.js
import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true }, // e.g. "2021 – Present"
    summary: { type: String, default: '' },
  },
  { _id: false }
);

const StatsSchema = new mongoose.Schema(
  {
    jobsCompleted: { type: Number, default: 0 },
    hoursWorked: { type: Number, default: 0 },
    jobSuccess: { type: Number, default: 0 }, // 0–100, will render with %
    memberSince: { type: String, default: '' }, // e.g. "2018"
  },
  { _id: false }
);

const FreelancerSchema = new mongoose.Schema(
  {
    // One-to-one with User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    title: { type: String, required: true }, // "Full-stack JS Developer"
    overview: { type: String, default: '' },

    hourlyRate: { type: Number, required: true }, // e.g. 40
    currency: { type: String, default: 'USD' },   // just for future proof

    location: { type: String, default: 'Remote' },

    skills: [{ type: String }],

    stats: { type: StatsSchema, default: () => ({}) },

    experiences: { type: [ExperienceSchema], default: () => [] },
  },
  { timestamps: true }
);

export const Freelancer = mongoose.model('Freelancer', FreelancerSchema);
