// server/src/routes/freelancers.js
import express from 'express';
import { freelancers } from '../data/freelancers.js';
import { authRequired } from '../middleware/authRequired.js';
import { Job } from '../models/Job.js';
import { MessageThread } from '../models/MessageThread.js';
import { Message } from '../models/Message.js';

const router = express.Router();

// GET /api/freelancers - list freelancers (summary)
router.get('/', (req, res) => {
  const list = freelancers.map((f) => ({
    id: f.id,
    name: f.name,
    title: f.title,
    rate: f.rate,
    location: f.location,
    skills: f.skills,
  }));
  res.json(list);
});

// GET /api/freelancers/:id - full profile details
router.get('/:id', (req, res) => {
  const freelancer = freelancers.find((f) => f.id === req.params.id);
  if (!freelancer) {
    return res.status(404).json({ message: 'Freelancer not found' });
  }
  res.json(freelancer);
});

// POST /api/freelancers/:id/invite - invite freelancer to a job
router.post('/:id/invite', authRequired, async (req, res) => {
  try {
    const freelancer = freelancers.find((f) => f.id === req.params.id);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can invite freelancers' });
    }

    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: 'Missing jobId' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Look for existing thread between this client and freelancer for this job
    let thread = await MessageThread.findOne({
      job: job._id,
      participantName: freelancer.name,
      participants: { $in: [req.user.id] },
    });

    if (!thread) {
      thread = await MessageThread.create({
        participants: [req.user.id],
        participantName: freelancer.name,
        participantRole: 'Freelancer',
        jobTitle: job.title,
        job: job._id,
        lastActive: new Date(),
      });

      // Optional: create initial auto-message
      await Message.create({
        thread: thread._id,
        from: 'me',
        text: `Hi ${freelancer.name}, I'd like to invite you to the job "${job.title}".`,
      });
    }

    res.status(201).json({ threadId: thread._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to invite freelancer' });
  }
});

export default router;
