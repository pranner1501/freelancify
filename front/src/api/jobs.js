// src/api/jobs.js
import { apiGet, apiPost } from './client.js';

export function listJobs(token) {
  return apiGet('/jobs', token);
}

export function getJobDetails(jobId, token) {
  return apiGet(`/jobs/${jobId}`, token);
}

export function createJob(payload, token) {
  return apiPost('/jobs', payload, token);
}

export function applyToJob(jobId, payload, token) {
  return apiPost(`/jobs/${jobId}/apply`, payload, token);
}

export function listMyJobs(token) {
  return apiGet('/jobs/my', token);
}