// server/src/routes/jobs.js
import express from 'express';
import { Job } from '../models/Job.js';
import { Proposal } from '../models/Proposal.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

// helper to build display string
function buildBudgetDisplay(job) {
  if (job.budgetType === 'hourly') {
    return `$${job.budgetAmount}/hr`;
  }
  return `$${job.budgetAmount}`;
}

// GET /api/jobs - list jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();
    const mapped = jobs.map((job) => ({
      id: job._id.toString(),
      title: job.title,
      type: job.type,
      level: job.level,
      budget: job.budgetDisplay || buildBudgetDisplay(job),
      tags: job.tags || [],
      createdAt: job.createdAt,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/my - jobs for current client
router.get('/my', authRequired, async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = jobs.map((job) => ({
      id: job._id.toString(),
      title: job.title,
      type: job.type,
      level: job.level,
      budget: job.budgetDisplay || buildBudgetDisplay(job),
      tags: job.tags || [],
      createdAt: job.createdAt,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
});

// GET /api/jobs/:id - job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      id: job._id.toString(),
      title: job.title,
      type: job.type,
      level: job.level,
      budget: job.budgetDisplay || buildBudgetDisplay(job),
      tags: job.tags || [],
      postedAgo: job.createdAt,
      projectType: job.projectType,
      description: job.description,
      responsibilities: [], // can fill later
      client: {
        name: job.clientName || 'Client',
        location: 'Remote',
        memberSince: '2024',
        totalSpent: '$0+',
        jobsPosted: 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
});

// POST /api/jobs - create new job (client only)
router.post('/', authRequired, async (req, res) => {
  try {
    const {
      title,
      description,
      projectType,
      budgetType,
      budgetAmount,
      level,
      tags,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      projectType,
      budgetType,
      budgetAmount,
      level,
      tags: Array.isArray(tags) ? tags : [],
      type: budgetType === 'hourly' ? 'Hourly' : 'Fixed',
      budgetDisplay:
        budgetType === 'hourly'
          ? `$${budgetAmount}/hr`
          : `$${budgetAmount}`,
      client: req.user.id,
      clientName: req.user.fullName,
    });

    res.status(201).json({ id: job._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create job' });
  }
});

// POST /api/jobs/:id/apply - apply to a job (freelancer only)
router.post('/:id/apply', authRequired, async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const { coverLetter, rateType, rateAmount, availability } = req.body;

    const proposal = await Proposal.create({
      job: job._id,
      freelancer: req.user.id,
      freelancerName: req.user.fullName,
      coverLetter,
      rateType,
      rateAmount,
      availability,
    });

    res.status(201).json({ id: proposal._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to submit proposal' });
  }
});

export default router;
