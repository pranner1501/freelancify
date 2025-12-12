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

// NEW: create/update current freelancer's profile
export function upsertMyFreelancerProfile(payload, token) {
  return apiPost('/freelancers/me', payload, token);
}
