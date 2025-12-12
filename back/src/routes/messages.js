// server/src/routes/messages.js
import express from 'express';
import { MessageThread } from '../models/MessageThread.js';
import { Message } from '../models/Message.js';

const router = express.Router();

// GET /api/messages/threads
router.get('/threads', async (req, res) => {
  try {
    const threads = await MessageThread.find().sort({ updatedAt: -1 }).lean();

    const result = await Promise.all(
      threads.map(async (thread) => {
        const lastMessage = await Message.findOne({ thread: thread._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: thread._id.toString(),
          participantName: thread.participantName,
          participantRole: thread.participantRole,
          jobTitle: thread.jobTitle,
          lastActive: thread.lastActive,
          lastMessageText: lastMessage ? lastMessage.text : '',
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
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
