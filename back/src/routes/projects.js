// server/src/routes/projects.js
import express from 'express';
import { Project } from '../models/Project.js';
import { Proposal } from '../models/Proposal.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

// helper to build display string
function buildBudgetDisplay(project) {
  if (project.budgetType === 'hourly') {
    return `$${project.budgetAmount}/hr`;
  }
  return `$${project.budgetAmount}`;
}

// GET /api/projects - list projects (public, generic explore)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    const mapped = projects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      type: project.type,
      level: project.level,
      budget: project.budgetDisplay || buildBudgetDisplay(project),
      tags: project.tags || [],
      createdAt: project.createdAt,
      status: project.status,
      deadline: project.deadline,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/explore - projects not owned by current client
router.get('/explore', authRequired, async (req, res) => {
  try {
    // Show all projects that are not created by this user (or have no client set)
    const projects = await Project.find({
      $or: [
        { client: { $exists: false } },
        { client: { $ne: req.user.id } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = projects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      type: project.type,
      level: project.level,
      budget: project.budgetDisplay || buildBudgetDisplay(project),
      tags: project.tags || [],
      createdAt: project.createdAt,
      status: project.status,
      deadline: project.deadline,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch explore projects' });
  }
});

// GET /api/projects/my - projects for current client (with proposal counts)
router.get('/my', authRequired, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = await Promise.all(
      projects.map(async (project) => {
        const proposalsCount = await Proposal.countDocuments({ project: project._id });
        return {
          id: project._id.toString(),
          title: project.title,
          type: project.type,
          level: project.level,
          budget: project.budgetDisplay || buildBudgetDisplay(project),
          tags: project.tags || [],
          createdAt: project.createdAt,
          status: project.status,
          deadline: project.deadline,
          proposalsCount,
        };
      })
    );

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your projects' });
  }
});

// GET /api/projects/assigned - list projects assigned to the logged-in freelancer
router.get('/assigned', authRequired, async (req, res) => {
  try {
    const freelancerId = req.user.id;

    // find accepted proposals for this freelancer and populate project
    const acceptedProposals = await Proposal.find({
      freelancer: freelancerId,
      status: 'accepted',
    })
      .populate('project')
      .lean();

    const mapped = acceptedProposals.map((p) => {
      const project = p.project || {};
      return {
        proposalId: p._id.toString(),
        projectId: project._id ? project._id.toString() : null,
        title: project.title || p.projectTitle || 'Unknown project',
        budget: project.budgetDisplay || (project.budgetAmount ? `$${project.budgetAmount}` : ''),
        status: project.status || 'in_progress',
        deadline: project.deadline || null,
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
    console.error('GET /api/projects/assigned err in back', err);
    res.status(500).json({ message: 'Failed to fetch assigned projects back' });
  }
});

// GET /api/projects/:id - project details (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      id: project._id.toString(),
      title: project.title,
      type: project.type,
      level: project.level,
      budget: project.budgetDisplay || buildBudgetDisplay(project),
      tags: project.tags || [],
      postedAgo: project.createdAt,
      projectType: project.projectType,
      description: project.description,
      responsibilities: [], // can fill later
      client: {
        id: project.client?._id.toString(),
        name: project.clientName || 'Client',
        location: 'Remote',
        memberSince: '2024',
        totalSpent: '$0+',
        projectsPosted: 0,
      },
      status: project.status,
      deadline: project.deadline,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch project details' });
  }
});

// GET /api/projects/:id/proposals - view proposals for a project (client only)
router.get('/:id/proposals', authRequired, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only the client who owns this project can see proposals
    if (!project.client || project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to view proposals for this project' });
    }

    const proposals = await Proposal.find({ project: project._id })
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
      project: {
        id: project._id.toString(),
        title: project.title,
        status: project.status,
      },
      proposals: mapped,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch proposals' });
  }
});

// POST /api/projects - create new project (client only)
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

    const project = await Project.create({
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

    res.status(201).json({ id: project._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create project' });
  }
});

// POST /api/projects/:id/apply - apply to a project (freelancer only)
router.post('/:id/apply', authRequired, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { coverLetter, rateType, rateAmount, availability } = req.body;

    const proposal = await Proposal.create({
      project: project._id,
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
