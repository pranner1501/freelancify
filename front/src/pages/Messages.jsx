// src/pages/Messages.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { listThreads, getThread, sendMessage } from '../api/messages.js';
import { useAuth } from '../context/AuthContext.jsx';

const SOCKET_URL = 'http://localhost:4000';

function Messages() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState(null);

  const [socket, setSocket] = useState(null);

  // Load list of threads
  useEffect(() => {
    async function loadThreads() {
      setError(null);
      setLoadingThreads(true);
      try {
        const data = await listThreads(token);
        setThreads(data);

        const initial =
          data.find((t) => t.id === threadId) || (data.length > 0 ? data[0] : null);

        if (initial) {
          setActiveThreadId(initial.id);
          if (!threadId) {
            navigate(`/messages/${initial.id}`, { replace: true });
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load conversations.');
      } finally {
        setLoadingThreads(false);
      }
    }

    if (user) {
      loadThreads();
    } else {
      setLoadingThreads(false);
    }
  }, [token, user, threadId, navigate]);

  // Load messages for active thread
  useEffect(() => {
    if (!activeThreadId) {
      setActiveThread(null);
      return;
    }

    async function loadThread() {
      setLoadingThread(true);
      setError(null);
      try {
        const data = await getThread(activeThreadId, token);
        setActiveThread(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load conversation.');
      } finally {
        setLoadingThread(false);
      }
    }

    loadThread();
  }, [activeThreadId, token]);

  // Setup socket connection
  useEffect(() => {
    if (!user) {
      return;
    }

    const s = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token, user]);

  // Join room / listen for new messages
  useEffect(() => {
    if (!socket || !activeThreadId) return;

    socket.emit('join-thread', activeThreadId);

    function handleNewMessage(payload) {
      if (payload.threadId !== activeThreadId) return;

      setActiveThread((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, {
            id: payload.id,
            from: payload.from,
            text: payload.text,
            createdAt: payload.createdAt,
          }],
        };
      });
    }

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.emit('leave-thread', activeThreadId);
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, activeThreadId]);

  function handleSelectThread(id) {
    setActiveThreadId(id);
    navigate(`/messages/${id}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!draftMessage.trim() || !activeThreadId) return;

    try {
      const messageText = draftMessage.trim();
      setDraftMessage('');

      const sent = await sendMessage(
        activeThreadId,
        {
          from: user.id.toString(),
          text: messageText,
        },
        token
      );

      // Optimistic: ensure it's shown even before socket event
      
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    }
  }

  if (!user) {
    return (
      <section className="page">
        <h1>Messages</h1>
        <p>You must be logged in to view your messages.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  return (
    <section className="page messages-page">
      <header className="page-header">
        <h1>Messages</h1>
        <p>Chat with clients and freelancers.</p>
      </header>

      <div className="messages-layout">
        <aside className="conversation-list">
          <div className="conversation-list-header">
            <h2>Conversations</h2>
          </div>

          {loadingThreads && <p className="conversation-empty">Loading...</p>}
          {error && (
            <p className="conversation-empty" style={{ color: 'red' }}>
              {error}
            </p>
          )}
          {!loadingThreads && threads.length === 0 && !error && (
            <p className="conversation-empty">No conversations yet.</p>
          )}

          <ul className="conversation-items">
            {threads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <li
                  key={t.id}
                  className={
                    'conversation-item' + (isActive ? ' conversation-item-active' : '')
                  }
                  onClick={() => handleSelectThread(t.id)}
                >
                  <div className="conversation-avatar">
                    {t.participantName.charAt(0)}
                  </div>
                  <div className="conversation-main">
                    <div className="conversation-top">
                      <span className="conversation-name">{t.participantName}</span>
                      <span className="conversation-time">
                        {typeof t.lastActive === 'string'
                          ? t.lastActive
                          : ''}
                      </span>
                    </div>
                    <p className="conversation-job">{t.jobTitle}</p>
                    <p className="conversation-preview">
                      {t.lastMessageText || ''}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="message-panel">
          {!activeThread && !loadingThread && (
            <div className="message-empty">
              <p>Select a conversation to start messaging.</p>
            </div>
          )}

          {loadingThread && (
            <div className="message-empty">
              <p>Loading conversation...</p>
            </div>
          )}

          {activeThread && !loadingThread && (
            <>
              <div className="message-panel-header">
                <div>
                  <h2>{activeThread.participantName}</h2>
                  <p className="message-header-meta">
                    {activeThread.participantRole} · {activeThread.jobTitle}
                  </p>
                </div>
                <Link to="/jobs" className="btn btn-ghost-sm">
                  View jobs
                </Link>
              </div>

              <div className="message-feed">
                {activeThread.messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      'message-bubble ' + (m.from === user.id.toString() ? 'message-bubble-me' : 'message-bubble-them')
                    }
                  >
                    <p className="message-text">{m.text}</p>
                    <span className="message-time">{m.time}</span>
                  </div>
                ))}
              </div>

              <form className="message-composer" onSubmit={handleSubmit}>
                <textarea
                  rows="2"
                  placeholder="Type your message..."
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                />
                <div className="message-composer-actions">
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Messages;
