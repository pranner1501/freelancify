// server/src/routes/freelancers.js
import express from 'express';
import { authRequired } from '../middleware/authRequired.js';
import { Project } from '../models/Project.js';
import { MessageThread } from '../models/MessageThread.js';
import { Message } from '../models/Message.js';
import { Freelancer } from '../models/Freelancer.js';

const router = express.Router();

// Helper: map Freelancer doc to the list card shape
function mapFreelancerListItem(doc) {
  const user = doc.user || {};
  const rate = doc.hourlyRate ? `$${doc.hourlyRate}/hr` : '';
  return {
    id: doc._id.toString(),
    name: user.fullName || 'Unnamed',
    title: doc.title,
    rate,
    location: doc.location,
    skills: doc.skills || [],
  };
}

// Helper: map Freelancer doc to full profile shape
function mapFreelancerProfile(doc) {
  const user = doc.user || {};
  const rate = doc.hourlyRate ? `$${doc.hourlyRate}/hr` : '';
  const stats = doc.stats || {};

  return {
    id: doc._id.toString(),
    userId: user._id ? user._id.toString() : null,
    name: user.fullName || 'Unnamed',
    title: doc.title,
    rate,
    location: doc.location,
    overview: doc.overview,
    skills: doc.skills || [],
    stats: {
      projectsCompleted: stats.projectsCompleted || 0,
      hoursWorked: stats.hoursWorked || 0,
      // Frontend expects "98%" style
      projectSuccess: (stats.projectSuccess ?? 0) + '%',
      memberSince: stats.memberSince || '',
    },
    experiences: doc.experiences || [],
  };
}

// GET /api/freelancers - list freelancers (summary)
router.get('/', async (req, res) => {
  try {
    const docs = await Freelancer.find().populate('user', 'fullName').lean();
    const mapped = docs.map((doc) => mapFreelancerListItem(doc));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch freelancers' });
  }
});

// GET /api/freelancers/:id - full profile details
router.get('/:id', async (req, res) => {
  try {
    const doc = await Freelancer.findById(req.params.id)
      .populate('user', 'fullName email')
      .lean();
    if (!doc) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }
    res.json(mapFreelancerProfile(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch freelancer profile' });
  }
});

// POST /api/freelancers/:id/invite - invite freelancer to a project
router.post('/:id/invite', authRequired, async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id)
      .populate('user', 'fullName')
      .lean();

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can invite freelancers' });
    }

    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: 'Missing projectId' });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Look for existing thread between this client and this freelancer for this project
    let thread = await MessageThread.findOne({
      project: project._id,
      participants: { $all: [req.user.id, freelancer.user._id.toString()] },
    });

    if (!thread) {
      thread = await MessageThread.create({
        participants: [req.user.id, freelancer.user._id],
        participantName: freelancer.user.fullName,
        participantRole: 'Freelancer',
        projectTitle: project.title,
        project: project._id,
        lastActive: new Date(),
      });

      // Optional: initial message
      await Message.create({
        thread: thread._id,
        from: 'me',
        text: `Hi ${freelancer.user.fullName}, I'd like to invite you to the project "${project.title}".`,
      });
    }

    res.status(201).json({ threadId: thread._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to invite freelancer' });
  }
});

// POST /api/freelancers/me - create or update current user's freelancer profile
router.post('/me', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res
        .status(403)
        .json({ message: 'Only freelancer accounts can edit profiles' });
    }

    const {
      title,
      overview,
      hourlyRate,
      currency,
      location,
      skills,
      stats,
      experiences,
    } = req.body;

    const update = {
      title,
      overview,
      hourlyRate,
      currency: currency || 'USD',
      location,
      skills: Array.isArray(skills) ? skills : [],
      stats: stats || {},
      experiences: Array.isArray(experiences) ? experiences : [],
    };

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const doc = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, ...update },
      options
    ).populate('user', 'fullName');

    res.json(mapFreelancerProfile(doc));
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to save freelancer profile' });
  }
});

export default router;
