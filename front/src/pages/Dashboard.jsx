// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="page page-dashboard">
        <header className="page-header">
          <h1>Dashboard</h1>
          <p>Please log in to see your activity.</p>
        </header>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  return (
    <section className="page page-dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user.fullName}.</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Account</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
        <div className="dashboard-card">
          <h2>Jobs</h2>
          {user.role === 'client' ? (
            <>
              <p>Post a new job to get started.</p>
              <Link to="/jobs/new" className="btn btn-ghost-sm">
                Post a job
              </Link>
            </>
          ) : (
            <>
              <p>Browse jobs that match your skills.</p>
              <Link to="/jobs" className="btn btn-ghost-sm">
                Browse jobs
              </Link>
            </>
          )}
        </div>
        <div className="dashboard-card">
          <h2>Messages</h2>
          <p>Chat with clients and freelancers.</p>
          <Link to="/messages" className="btn btn-ghost-sm">
            Open messages
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
