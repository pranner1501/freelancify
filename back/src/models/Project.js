// server/src/models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
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

    // NEW: link to client user
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    clientName: { type: String, default: 'Demo Client' },

    // NEW: project lifecycle status
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'closed'],
      default: 'open',
    },

    // NEW: optional deadline to compute "time remaining"
    deadline: { type: Date },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', ProjectSchema);
