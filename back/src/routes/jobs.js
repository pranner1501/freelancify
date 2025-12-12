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

// GET /api/jobs - list jobs (public, generic explore)
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
      status: job.status,
      deadline: job.deadline,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/explore - jobs not owned by current client
router.get('/explore', authRequired, async (req, res) => {
  try {
    // Show all jobs that are not created by this user (or have no client set)
    const jobs = await Job.find({
      $or: [
        { client: { $exists: false } },
        { client: { $ne: req.user.id } },
      ],
    })
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
      status: job.status,
      deadline: job.deadline,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch explore jobs' });
  }
});

// GET /api/jobs/my - jobs for current client (with proposal counts)
router.get('/my', authRequired, async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = await Promise.all(
      jobs.map(async (job) => {
        const proposalsCount = await Proposal.countDocuments({ job: job._id });
        return {
          id: job._id.toString(),
          title: job.title,
          type: job.type,
          level: job.level,
          budget: job.budgetDisplay || buildBudgetDisplay(job),
          tags: job.tags || [],
          createdAt: job.createdAt,
          status: job.status,
          deadline: job.deadline,
          proposalsCount,
        };
      })
    );

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
});

// GET /api/jobs/assigned - list jobs assigned to the logged-in freelancer
router.get('/assigned', authRequired, async (req, res) => {
  try {
    const freelancerId = req.user.id;

    // find accepted proposals for this freelancer and populate job
    const acceptedProposals = await Proposal.find({
      freelancer: freelancerId,
      status: 'accepted',
    })
      .populate('job')
      .lean();

    const mapped = acceptedProposals.map((p) => {
      const job = p.job || {};
      return {
        proposalId: p._id.toString(),
        jobId: job._id ? job._id.toString() : null,
        title: job.title || p.jobTitle || 'Unknown job',
        budget: job.budgetDisplay || (job.budgetAmount ? `$${job.budgetAmount}` : ''),
        status: job.status || 'in_progress',
        deadline: job.deadline || null,
        awardedAt: p.updatedAt || p.createdAt,
        proposal: {
          id: p._id.toString(),
          rateType: p.rateType,
          rateAmount: p.rateAmount,
          availability: p.availability,
          coverLetter: p.coverLetter,
        },
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error('GET /api/jobs/assigned err in back', err);
    res.status(500).json({ message: 'Failed to fetch assigned jobs back' });
  }
});

// GET /api/jobs/:id - job details (public)
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
        id: job.client?._id.toString(),
        name: job.clientName || 'Client',
        location: 'Remote',
        memberSince: '2024',
        totalSpent: '$0+',
        jobsPosted: 0,
      },
      status: job.status,
      deadline: job.deadline,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
});

// GET /api/jobs/:id/proposals - view proposals for a job (client only)
router.get('/:id/proposals', authRequired, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the client who owns this job can see proposals
    if (!job.client || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to view proposals for this job' });
    }

    const proposals = await Proposal.find({ job: job._id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = proposals.map((p) => ({
      id: p._id.toString(),
      freelancerName: p.freelancerName,
      rateType: p.rateType,
      rateAmount: p.rateAmount,
      availability: p.availability,
      status: p.status,
      coverLetter: p.coverLetter,
      createdAt: p.createdAt,
    }));

    res.json({
      job: {
        id: job._id.toString(),
        title: job.title,
        status: job.status,
      },
      proposals: mapped,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch proposals' });
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
      deadline,
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
      status: 'open',
      deadline: deadline ? new Date(deadline) : undefined,
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
