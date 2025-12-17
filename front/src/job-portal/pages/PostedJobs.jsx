import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

function PostedJobs() {
  const { user, token } = useAuth();

  const [jobs, setJobs] = useState([]);
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
        const data = await apiGet('/jobs/posts', token);
        setJobs(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load your posted jobs.');
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
        <h1>Posted Jobs</h1>
        <p>You must be logged in as an employer.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (user.role !== 'client') {
    return (
      <section className="page">
        <h1>Posted Jobs</h1>
        <p>Only employer accounts can post and manage jobs.</p>
        <Link to="/jobs-portal/search" className="btn btn-primary">
          Browse jobs
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading your jobs…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Posted Jobs</h1>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        <Link to="/jobs-portal" className="btn btn-primary">
          Back
        </Link>
      </section>
    );
  }

  /* ───────── Main Render ───────── */

  return (
    <section className="page">
      <header className='application-header'>
        <div>
        <h1>Your Posted Jobs</h1>
        <p className="page-subtitle">
          Manage jobs you’ve posted on Freelancify Jobs.
        </p>
        </div>
        <Link to="/jobs-portal/post" className="btn btn-primary">
          + Post new job
        </Link>
      </header>

      {jobs.length === 0 && (
        <p>You haven’t posted any jobs yet.</p>
      )}

      <div className="jobs-list">
        {jobs.map((job) => (
          <article key={job.id} className="project-card">
            <h3>{job.title}</h3>

            <p className="job-meta">
              Status:{' '}
              <strong style={{ textTransform: 'capitalize' }}>
                {job.status}
              </strong>
            </p>

            <p className="job-meta">
              Posted on:{' '}
              {new Date(job.createdAt).toLocaleDateString()}
            </p>

            <div style={{ marginTop: '0.5rem' }}>
              <Link
                to={`/jobs-portal/employer/jobs/${job.id}`}
                className="btn btn-ghost-sm"
              >
                View applicants
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PostedJobs;
