// server/src/routes/debug.js
import express from 'express';
import { Proposal } from '../models/Proposal.js';
import { Job } from '../models/Job.js';
import { Freelancer } from '../models/Freelancer.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/debug/all-proposals
 * Returns every Proposal document in the DB (populates job + freelancer if possible).
 * No auth.
 */
router.get('/all-proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('job') // may be null for older docs
      .populate('freelancer', 'fullName') // if freelancer is stored as user ref inside Proposal
      .lean();

    // Return raw DB entries (mapped to JSON) so you can inspect everything.
    return res.json({ count: proposals.length, proposals });
  } catch (err) {
    console.error('GET /api/debug/all-proposals error', err);
    return res.status(500).json({ message: 'Failed to fetch proposals', error: String(err) });
  }
});

/**
 * GET /api/debug/all-assigned-jobs
 * Returns jobs that have accepted proposals (shows the accepted proposal and job).
 * No auth.
 */
router.get('/all-assigned-jobs', async (req, res) => {
  try {
    // Find all proposals with status 'accepted'
    const accepted = await Proposal.find({ status: 'accepted' })
      .populate('job') // job document
      .populate('freelancer', 'fullName')
      .lean();

    // Map to helpful shape so each accepted proposal -> its job and proposal details
    const mapped = accepted.map((p) => {
      return {
        proposalId: p._id?.toString(),
        proposalStatus: p.status,
        proposalCreatedAt: p.createdAt,
        freelancer: p.freelancer || { name: p.freelancerName },
        job: p.job || null,
        rawProposal: p, // include full proposal for inspection
      };
    });

    return res.json({ count: mapped.length, assigned: mapped });
  } catch (err) {
    console.error('GET /api/debug/all-assigned-jobs error', err);
    return res.status(500).json({ message: 'Failed to fetch assigned jobs', error: String(err) });
  }
});

export default router;
