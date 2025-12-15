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
    projectTitle: { type: String, required: true },

    // Link to a specific project (optional but helpful)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },

    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MessageThread = mongoose.model('MessageThread', MessageThreadSchema);
