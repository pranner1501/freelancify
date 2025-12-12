// server/src/routes/proposals.js
import express from 'express';
import mongoose from 'mongoose';
import { Proposal } from '../models/Proposal.js';
import { Job } from '../models/Job.js';
import { MessageThread } from '../models/MessageThread.js';
import { Message } from '../models/Message.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

// GET /api/proposals/me - proposals for logged-in freelancer
router.get('/me', authRequired, async (req, res) => {
  try {
    const freelancerId = req.user.id;
    console.log('freeId:', freelancerId, req.user.id);
    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate('job', 'title budgetDisplay') // include job title
      .sort({ createdAt: -1 })
      .lean();

    const mapped = proposals.map((p) => ({
      id: p._id.toString(),
      jobId: p.job?._id?.toString() || null,
      jobTitle: p.job?.title || '',
      freelancerName: p.freelancerName,
      rateType: p.rateType,
      rateAmount: p.rateAmount,
      availability: p.availability,
      status: p.status,
      coverLetter: p.coverLetter,
      createdAt: p.createdAt,
    }));

    res.json(mapped);
  } catch (err) {
    console.error('GET /api/proposals/me err in back', err);
    res.status(500).json({ message: 'Failed to fetch your proposals back' });
  }
});

// GET /api/proposals/:id
router.get('/:id', authRequired, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const proposal = await Proposal.findById(id)
      .populate('job')
      .populate('freelancer', 'fullName email')
      .lean();

    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const jobOwnerId = proposal.job?.client?.toString();
    const freelancerUserId = proposal.freelancer?._id?.toString();

    if (req.user.id !== jobOwnerId && req.user.id !== freelancerUserId) {
      return res.status(403).json({ message: 'Not authorized to view this proposal' });
    }

    res.json({
      id: proposal._id.toString(),
      job: {
        id: proposal.job?._id?.toString(),
        title: proposal.job?.title,
        budget: proposal.job?.budgetDisplay,
        status: proposal.job?.status,
        clientId: proposal.job?.client?.toString(),
      },
      freelancer: {
        id: freelancerUserId,
        name: proposal.freelancer?.fullName || proposal.freelancerName,
      },
      coverLetter: proposal.coverLetter,
      rateType: proposal.rateType,
      rateAmount: proposal.rateAmount,
      availability: proposal.availability,
      status: proposal.status,
      createdAt: proposal.createdAt,
    });
  } catch (err) {
    console.error('GET /api/proposals/:id error', err);
    res.status(500).json({ message: 'Failed to fetch proposal' });
  }
});

// POST /api/proposals/:id/award
router.post('/:id/award', authRequired, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const proposal = await Proposal.findById(id).populate('job').populate('freelancer').exec();
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const job = proposal.job;
    if (!job) return res.status(400).json({ message: 'Associated job not found' });

    if (!job.client || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the client who posted the job can award a proposal' });
    }

    // mark others rejected, current accepted
    await Proposal.updateMany({ job: job._id }, { $set: { status: 'rejected' } });
    proposal.status = 'accepted';
    await proposal.save();

    // update job status
    await Job.updateOne({ _id: job._id }, { $set: { status: 'in_progress' } });

    // create/find thread between client and freelancer
    let thread = await MessageThread.findOne({
      job: job._id,
      participants: { $all: [req.user.id, proposal.freelancer._id] },
    });

    if (!thread) {
      thread = await MessageThread.create({
        participants: [req.user.id, proposal.freelancer._id],
        participantName: proposal.freelancer.fullName || proposal.freelancerName,
        participantRole: 'Freelancer',
        jobTitle: job.title,
        job: job._id,
        lastActive: new Date(),
      });

      await Message.create({
        thread: thread._id,
        from: 'me',
        text: `Hi ${proposal.freelancer.fullName || proposal.freelancerName}, your proposal has been accepted for the job "${job.title}". Let's discuss next steps.`,
      });
    } else {
      await Message.create({
        thread: thread._id,
        from: 'me',
        text: `The client has awarded the job "${job.title}".`,
      });
      thread.lastActive = new Date();
      await thread.save();
    }

    res.json({ threadId: thread._id.toString() });
  } catch (err) {
    console.error('POST /api/proposals/:id/award error', err);
    res.status(500).json({ message: 'Failed to award proposal' });
  }
});

// POST /api/proposals/:id/start-thread
router.post('/:id/start-thread', authRequired, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const proposal = await Proposal.findById(id).populate('job').populate('freelancer').exec();
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const job = proposal.job;
    const freelancerUser = proposal.freelancer;
    const freelancerUserId = freelancerUser ? freelancerUser._id : null;

    const allowed =
      req.user.id === (job?.client?.toString()) ||
      req.user.id === (freelancerUserId ? freelancerUserId.toString() : null);

    if (!allowed) {
      return res.status(403).json({ message: 'Not authorized to start thread for this proposal' });
    }

    let thread = await MessageThread.findOne({
      job: job._id,
      participants: { $all: [req.user.id, freelancerUserId] },
    });

    if (!thread) {
      thread = await MessageThread.create({
        participants: [req.user.id, freelancerUserId],
        participantName: freelancerUser.fullName || proposal.freelancerName,
        participantRole: 'Freelancer',
        jobTitle: job.title,
        job: job._id,
        lastActive: new Date(),
      });

      await Message.create({
        thread: thread._id,
        from: 'me',
        text: `Hi ${freelancerUser.fullName || proposal.freelancerName}, let's discuss the proposal for "${job.title}".`,
      });
    }

    res.json({ threadId: thread._id.toString() });
  } catch (err) {
    console.error('POST /api/proposals/:id/start-thread error', err);
    res.status(500).json({ message: 'Failed to start thread' });
  }
});



export default router;
