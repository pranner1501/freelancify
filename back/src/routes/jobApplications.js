import express from 'express';
import mongoose from 'mongoose';
import { JobApplication } from '../models/JobApplication.js';
import { Job } from '../models/Job.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

/**
 * GET /api/job-applications/me
 * Applicant views their applications
 */
router.get('/my', authRequired, async (req, res) => {
  try {
    const applications = await JobApplication.find({
      applicant: req.user.id,
    })
      .populate('job', 'title organisation status')
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      applications.map((a) => ({
        id: a._id.toString(),
        job: a.job,
        status: a.status,
        appliedAt: a.createdAt,
      }))
    );
  } catch (err) {
    console.error('GET /job-applications/me error', err);
    res.status(500).json({ message: 'Failed to fetch your applications' });
  }
});

/**
 * GET /api/job-applications/job/:jobId
 * Employer views applications for their job
 */
router.get('/job/:jobId', authRequired, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await JobApplication.find({ job: jobId })
      .populate('applicant', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      applications.map((a) => ({
        id: a._id.toString(),
        applicant: a.applicant,
        status: a.status,
        coverLetter: a.coverLetter,
        resumeUrl: a.resumeUrl,
        appliedAt: a.createdAt,
      }))
    );
  } catch (err) {
    console.error('GET /job-applications/job/:id error', err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});


/**
 * PATCH /api/job-applications/:id/status
 * Employer updates application status
 */
router.patch('/:id/status', authRequired, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await JobApplication.findById(id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated' });
  } catch (err) {
    console.error('PATCH /job-applications/:id/status error', err);
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

export default router;
