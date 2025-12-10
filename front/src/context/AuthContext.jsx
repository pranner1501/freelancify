// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signupApi, loginApi, meApi } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const stored = window.localStorage.getItem('authToken');
    if (!stored) {
      setAuthLoading(false);
      return;
    }

    async function loadMe() {
      try {
        const data = await meApi(stored);
        setUser(data.user);
        setToken(stored);
      } catch (err) {
        console.error('Failed to restore session:', err);
        window.localStorage.removeItem('authToken');
      } finally {
        setAuthLoading(false);
      }
    }

    loadMe();
  }, []);

  function setSession(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      window.localStorage.setItem('authToken', newToken);
    } else {
      window.localStorage.removeItem('authToken');
    }
  }

  async function signup({ fullName, email, password, role }) {
    setAuthError(null);
    const data = await signupApi({ fullName, email, password, role });
    setSession(data.token, data.user);
    return data.user;
  }

  async function login({ email, password }) {
    setAuthError(null);
    const data = await loginApi({ email, password });
    setSession(data.token, data.user);
    return data.user;
  }

  function logout() {
    setSession(null, null);
  }

  const value = {
    user,
    token,
    authLoading,
    authError,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
