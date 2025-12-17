import express from 'express';
import { Job } from '../models/Job.js';

const router = express.Router();

/**
 * GET /api/jobs/search
 */
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      technologies,
      minExperience,
      level,
      type,
      minSalary,
      maxSalary,
      location,
      status = 'open',
      page = 1,
      limit = 10,
      sort = 'latest',
    } = req.query;

    const filter = { status };

    /* 🔍 keyword search */
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { organisation: { $regex: q, $options: 'i' } },
      ];
    }

    /* 🛠 technologies */
    if (technologies) {
      const techArray = technologies.split(',').map((t) => t.trim());
      filter['requirements.technologies'] = { $in: techArray };
    }

    /* 🎓 experience */
    if (minExperience) {
      filter['requirements.experience'] = {
        $gte: Number(minExperience),
      };
    }

    /* 🧭 level */
    if (level) {
      filter.level = level;
    }

    /* 🕘 job type */
    if (type) {
      filter.type = type;
    }

    /* 💰 salary */
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    /* 🌍 location */
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    /* ↕ sorting */
    let sortOption = { createdAt: -1 };
    if (sort === 'salary') sortOption = { salary: -1 };

    /* 📄 pagination */
    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Job.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      jobs: jobs.map((j) => ({
        id: j._id.toString(),
        title: j.title,
        level: j.level,
        type: j.type,
        salary: j.salary,
        organisation: j.organisation,
        location: j.location,
        createdAt: j.createdAt,
      })),
    });
  } catch (err) {
    console.error('GET /api/jobs/search error', err);
    res.status(500).json({ message: 'Failed to search jobs' });
  }
});

export default router;
