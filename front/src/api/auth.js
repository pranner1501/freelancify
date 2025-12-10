// src/api/auth.js
import { apiGet, apiPost } from './client.js';

export function signupApi({ fullName, email, password, role }) {
  return apiPost('/auth/signup', { fullName, email, password, role });
}

export function loginApi({ email, password }) {
  return apiPost('/auth/login', { email, password });
}

export function meApi(token) {
  return apiGet('/auth/me', token);
}
