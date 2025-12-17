import { apiGet, apiPost } from './client.js';

export function listJobs(token){
    return apiGet(`/jobs`,token);
}

export function postJob(payload,token){
    return apiPost(`/jobs`,payload, token)
}

export function listPostedJobs(token){
    return apiGet(`/jobs/posts`,token);
}
