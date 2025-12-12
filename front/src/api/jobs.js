// src/api/jobs.js
import { apiGet, apiPost } from './client.js';

export function listJobs(token) {
  return apiGet('/jobs', token);
}

export function listExploreJobs(token) {
  return apiGet('/jobs/explore', token);
}

export function listMyJobs(token) {
  return apiGet('/jobs/my', token);
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

export function getJobProposals(jobId, token) {
  return apiGet(`/jobs/${jobId}/proposals`, token);
}

export function listAssignedJobs(token) {
  return apiGet('/jobs/assigned', token);
}