// server/src/routes/messages.js
import express from 'express';
import { MessageThread } from '../models/MessageThread.js';
import { Message } from '../models/Message.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

// GET /api/messages/threads
router.get('/threads', authRequired, async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;

    if (!userId) {
      console.error('No user id on request:', req.user);
      return res.status(401).json({ message: 'Invalid auth token' });
    }
    const userIdStr = userId.toString();
    console.log('[messages] fetching threads for user:', userIdStr);

    const threads = await MessageThread.find({
      participants: userIdStr,
    })
      .sort({ lastActive: -1 })
      .lean();

    console.log('[messages] threads found:', threads.length);

    res.json(
      threads.map((t) => ({
        id: t._id.toString(),
        participantName: t.participantName,
        participantRole: t.participantRole,
        jobTitle: t.jobTitle,
        jobId: t.job?.toString(),
        lastActive: t.lastActive,
      }))
    );
  } catch (err) {
    console.error('GET /api/messages/threads ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch threads' });
  }
});

// GET /api/messages/threads/:id
router.get('/threads/:id', async (req, res) => {
  try {
    const thread = await MessageThread.findById(req.params.id).lean();
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const messages = await Message.find({ thread: thread._id })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      id: thread._id.toString(),
      participantName: thread.participantName,
      participantRole: thread.participantRole,
      jobTitle: thread.jobTitle,
      messages: messages.map((m) => ({
        id: m._id.toString(),
        from: m.from,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch thread' });
  }
});

// POST /api/messages/threads/:id/messages
// NOTE: socket.io hook will be wired in index.js; here we just save
router.post('/threads/:id/messages', async (req, res) => {
  try {
    const threadId = req.params.id;
    const { from, text } = req.body;

    const thread = await MessageThread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const msg = await Message.create({
      thread: thread._id,
      from: from,
      text,
    });

    thread.lastActive = new Date();
    await thread.save();

    res.status(201).json({
      id: msg._id.toString(),
      from: msg.from,
      text: msg.text,
      createdAt: msg.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to send message' });
  }
});

export default router;
