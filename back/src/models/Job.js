import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      technologies: {
        type: [String],
        default: [],
        index: true,
      },
      experience: {
        type: Number, // years
        default: 0,
      },
    },

    level: {
      type: String,
      enum: ['Junior', 'Intermediate', 'Senior', 'Lead'],
      default: 'Intermediate',
    },

    type: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
      default: 'Full Time',
    },

    salary: {
      type: Number, // monthly or yearly based on your UI
      required: true,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    organisation: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      default: 'Remote',
      index: true,
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['open', 'closed', 'filled'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);
