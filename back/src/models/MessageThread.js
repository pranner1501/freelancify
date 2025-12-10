// server/src/models/MessageThread.js
import mongoose from 'mongoose';

const MessageThreadSchema = new mongoose.Schema(
  {
    // participants (client + freelancer)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // For current UI:
    participantName: { type: String, required: true },
    participantRole: { type: String, default: 'Freelancer' },
    jobTitle: { type: String, required: true },

    // Link to a specific job (optional but helpful)
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },

    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MessageThread = mongoose.model('MessageThread', MessageThreadSchema);
