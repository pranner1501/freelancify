// server/src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/db.js';
import projectsRouter from './routes/projects.js';
import messagesRouter from './routes/messages.js';
import authRouter from './routes/auth.js';
import freelancersRouter from './routes/freelancers.js';
import proposalsRouter from './routes/proposals.js';
import jobsRouter from './routes/jobs.js';
import jobSerachRouter from './routes/jobSearch.js';
import jobApplicationRouter from './routes/jobApplications.js';

// import debugRouter from './routes/debug.js';

import { Message } from './models/Message.js';
import { MessageThread } from './models/MessageThread.js';

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// app.use('/api/debug', debugRouter);

app.use('/api/auth', authRouter);

app.use('/api/projects', projectsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/freelancers', freelancersRouter);
app.use('/api/jobs',jobSerachRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/job-applications', jobApplicationRouter);

// Socket.io events
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join-thread', (threadId) => {
    socket.join(threadId);
  });

  socket.on('leave-thread', (threadId) => {
    socket.leave(threadId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// Helper: when new message saved via REST, you can emit from here
// For now, we’ll watch Mongo post-save hook as an example
Message.watch().on('change', async (change) => {
  if (change.operationType === 'insert') {
    const docId = change.documentKey._id;
    const msg = await Message.findById(docId).lean();
    const thread = await MessageThread.findById(msg.thread).lean();

    const payload = {
      id: msg._id.toString(),
      from: msg.from,
      text: msg.text,
      createdAt: msg.createdAt,
      threadId: thread._id.toString(),
    };

    io.to(thread._id.toString()).emit('message:new', payload);
  }
});

// Start server
const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB(process.env.MONGODB_URI);

  httpServer.listen(PORT, () => {
    console.log(`🚀 API & Socket server running on http://localhost:${PORT}`);
  });
}

start();
