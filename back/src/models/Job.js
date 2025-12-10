// server/src/models/Job.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectType: { type: String, default: 'Ongoing project' },
    budgetType: { type: String, enum: ['hourly', 'fixed'], required: true },
    budgetAmount: { type: Number, required: true },
    level: { type: String, default: 'Intermediate' },
    tags: [{ type: String }],

    type: { type: String, default: 'Hourly' },
    budgetDisplay: { type: String },

    // NEW: actual client user
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // fallback display name
    clientName: { type: String, default: 'Demo Client' },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);
