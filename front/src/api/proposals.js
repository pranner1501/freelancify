// src/api/proposals.js
import { apiGet, apiPost } from './client.js';

export function getProposal(proposalId, token) {
  return apiGet(`/proposals/${proposalId}`, token);
}

export function awardProposal(proposalId, token) {
  return apiPost(`/proposals/${proposalId}/award`, {}, token);
}

export function startProposalThread(proposalId, token) {
  return apiPost(`/proposals/${proposalId}/start-thread`, {}, token);
}


export function listMyProposals(token) {
  return apiGet('/proposals/me', token);
}
