// src/job-portal/pages/MyApplications.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

function MyApplications() {
  const { user, token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiGet('/job-applications/my', token);
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load your job applications.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, token]);

  /* ───────── Guards ───────── */

  if (!user) {
    return (
      <section className="page">
        <h1>My Applications</h1>
        <p>You must be logged in to view your job applications.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (user.role === 'client') {
    return (
      <section className="page">
        <h1>My Applications</h1>
        <p>Employer accounts do not have job applications.</p>
        <Link to="/jobs-portal" className="btn btn-primary">
          Go to Job Portal
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading your applications…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>My Applications</h1>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        <Link to="/jobs-portal" className="btn btn-primary">
          Back to jobs
        </Link>
      </section>
    );
  }

  /* ───────── Main Render ───────── */

  return (
    <section className="page">
      <header className="page-header">
        <h1>My Job Applications</h1>
        <p className="page-subtitle">
          Track the status of jobs you have applied for.
        </p>
      </header>

      {applications.length === 0 && (
        <p>You haven’t applied to any jobs yet.</p>
      )}

      <div className="proposals-list">
        {applications.map((app) => (
          <article key={app.id} className="proposal-card">
            <div className="proposal-header">
              <h3>{app.job?.title || 'Job'}</h3>
              <span className={`status-pill status-${app.status}`}>
                {app.status}
              </span>
            </div>

            <p className="application-meta">
              {app.job?.organisation || '—'}
            </p>

            <p className="application-meta">
              Applied on:{' '}
              {new Date(app.appliedAt).toLocaleDateString()}
            </p>

            {app.job?._id && (
              <Link
                to={`/jobs-portal/jobs/${app.job._id}`}
                className="btn btn-ghost-sm"
              >
                View job
              </Link>
            )}
          </article>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/jobs-portal/search" className="btn btn-ghost">
          ← Browse more jobs
        </Link>
      </div>
    </section>
  );
}

export default MyApplications;
