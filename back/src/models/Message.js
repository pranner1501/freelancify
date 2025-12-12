// server/src/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MessageThread',
      required: true,
    },
    from: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
