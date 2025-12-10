// src/api/messages.js
import { apiGet, apiPost } from './client.js';

export function listThreads(token) {
  return apiGet('/messages/threads', token);
}

export function getThread(threadId, token) {
  return apiGet(`/messages/threads/${threadId}`, token);
}

export function sendMessage(threadId, { from, text }, token) {
  return apiPost(`/messages/threads/${threadId}/messages`, { from, text }, token);
}
