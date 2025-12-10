// src/api/freelancers.js
import { apiGet, apiPost } from './client.js';

export function listFreelancers(token) {
  return apiGet('/freelancers', token);
}

export function getFreelancer(freelancerId, token) {
  return apiGet(`/freelancers/${freelancerId}`, token);
}

export function inviteFreelancer(freelancerId, jobId, token) {
  return apiPost(
    `/freelancers/${freelancerId}/invite`,
    { jobId },
    token
  );
}
