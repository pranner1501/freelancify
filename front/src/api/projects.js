// src/api/projects.js
import { apiGet, apiPost } from './client.js';

export function listProjects(token) {
  return apiGet('/projects', token);
}

export function listExploreProjects(token) {
  return apiGet('/projects/explore', token);
}

export function listMyProjects(token) {
  return apiGet('/projects/my', token);
}

export function getProjectDetails(projectId, token) {
  return apiGet(`/projects/${projectId}`, token);
}

export function createProject(payload, token) {
  return apiPost('/projects', payload, token);
}

export function applyToProject(projectId, payload, token) {
  return apiPost(`/projects/${projectId}/apply`, payload, token);
}

export function getProjectProposals(projectId, token) {
  return apiGet(`/projects/${projectId}/proposals`, token);
}

export function listAssignedProjects(token) {
  return apiGet('/projects/assigned', token);
}