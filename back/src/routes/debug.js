// server/src/routes/debug.js
import express from 'express';
import { Proposal } from '../models/Proposal.js';
import { Project } from '../models/Project.js';
import { Freelancer } from '../models/Freelancer.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/debug/all-proposals
 * Returns every Proposal document in the DB (populates project + freelancer if possible).
 * No auth.
 */
router.get('/all-proposals', async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('project') // may be null for older docs
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
 * GET /api/debug/all-assigned-projects
 * Returns projects that have accepted proposals (shows the accepted proposal and project).
 * No auth.
 */
router.get('/all-assigned-projects', async (req, res) => {
  try {
    // Find all proposals with status 'accepted'
    const accepted = await Proposal.find({ status: 'accepted' })
      .populate('project') // project document
      .populate('freelancer', 'fullName')
      .lean();

    // Map to helpful shape so each accepted proposal -> its project and proposal details
    const mapped = accepted.map((p) => {
      return {
        proposalId: p._id?.toString(),
        proposalStatus: p.status,
        proposalCreatedAt: p.createdAt,
        freelancer: p.freelancer || { name: p.freelancerName },
        project: p.project || null,
        rawProposal: p, // include full proposal for inspection
      };
    });

    return res.json({ count: mapped.length, assigned: mapped });
  } catch (err) {
    console.error('GET /api/debug/all-assigned-projects error', err);
    return res.status(500).json({ message: 'Failed to fetch assigned projects', error: String(err) });
  }
});

export default router;
