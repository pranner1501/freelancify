import express from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/Job.js';
import { JobApplication } from '../models/JobApplication.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

/**
 * POST /api/jobs
 * Create a new job
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user.id,
    });

    res.status(201).json({
      id: job._id.toString(),
      title: job.title,
    });
  } catch (err) {
    console.error('POST /api/jobs error', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

/**
 * GET /api/jobs
 * Browse all open jobs (public)
 */
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      jobs.map((j) => ({
        id: j._id.toString(),
        title: j.title,
        level: j.level,
        type: j.type,
        salary: j.salary,
        organisation: j.organisation,
        location: j.location,
        createdAt: j.createdAt,
        deadline: j.deadline,
      }))
    );
  } catch (err) {
    console.error('GET /api/jobs error', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

/**
 * GET /api/jobs/posts
 * Jobs posted by current employer
 */
router.get('/posts', authRequired, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      jobs.map((j) => ({
        id: j._id.toString(),
        title: j.title,
        status: j.status,
        createdAt: j.createdAt,
        deadline: j.deadline,
      }))
    );
  } catch (err) {
    console.error('GET /api/jobs/mine error', err);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
});

/**
 * GET /api/jobs/:id
 * Job details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findById(id)
      .populate('employer', 'fullName email')
      .lean();

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({
      id: job._id.toString(),
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      level: job.level,
      type: job.type,
      salary: job.salary,
      organisation: job.organisation,
      location: job.location,
      deadline: job.deadline,
      status: job.status,
      employer: job.employer,
      createdAt: job.createdAt,
    });
  } catch (err) {
    console.error('GET /api/jobs/:id error', err);
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
});

/**
 * POST /api/jobs/:id/apply
 * Apply to a job
 */
router.post('/:id/apply', authRequired, async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).json({ message: 'JobId not found or invalid' });
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not open for applications' });
    }

    if (!coverLetter || !resumeUrl) {
      return res.status(400).json({
        message: 'Cover letter and resume URL are required',
      });
    }

    /* create job application */
    const application = await JobApplication.create({
      job: job._id,
      applicant: req.user.id,
      coverLetter,
      resumeUrl,
    });

    res.status(201).json({
      id: application._id.toString(),
      status: application.status,
    });
  } catch (err) {
    // Duplicate application error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    console.error('POST /job-applications error', err);
    res.status(500).json({ message: 'Failed to apply for job' });
  }
});

/**
 * PUT /api/jobs/:id
 * Update job (employer only)
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: 'Job updated' });
  } catch (err) {
    console.error('PUT /api/jobs/:id error', err);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

/**
 * DELETE /api/jobs/:id
 * Close job (soft delete)
 */
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job.status = 'closed';
    await job.save();

    res.json({ message: 'Job closed' });
  } catch (err) {
    console.error('DELETE /api/jobs/:id error', err);
    res.status(500).json({ message: 'Failed to close job' });
  }
});

export default router;
