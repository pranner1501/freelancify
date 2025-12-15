// server/src/models/Proposal.js
import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    // NEW: actual freelancer user
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // fallback display
    freelancerName: { type: String, default: 'Demo Freelancer' },

    coverLetter: { type: String, required: true },
    rateType: { type: String, enum: ['hourly', 'fixed'], required: true },
    rateAmount: { type: Number, required: true },
    availability: { type: String, default: 'Full-time' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model('Proposal', ProposalSchema);
