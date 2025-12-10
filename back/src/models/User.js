// server/src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    // aligns with frontend signup select: 'freelancer' | 'client'
    role: {
      type: String,
      enum: ['freelancer', 'client'],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
