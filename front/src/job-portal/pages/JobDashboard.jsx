import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

function JobDashboard() {
  const { user, token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        /* 1️⃣ Fetch employer jobs */
        const myJobs = await apiGet('/jobs/posts', token);
        setJobs(myJobs || []);

        /* 2️⃣ Fetch applicants count per job */
        const counts = {};

        for (const job of myJobs) {
          try {
            const apps = await apiGet(
              `/job-applications/job/${job.id}`,
              token
            );
            counts[job.id] = apps.length;
          } catch {
            counts[job.id] = 0;
          }
        }

        setApplicationsCount(counts);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, token]);

  /* ───────── Guards ───────── */

  if (!user) {
    return (
      <section className="page">
        <h1>Job Dashboard</h1>
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
        <h1>Job Dashboard</h1>
        <p>Only employer accounts can access this dashboard.</p>
        <Link to="/jobs-portal/search" className="btn btn-primary">
          Browse jobs
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading dashboard…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Job Dashboard</h1>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        <Link to="/jobs-portal/employer" className="btn btn-primary">
          Back to jobs
        </Link>
      </section>
    );
  }

  /* ───────── Aggregates ───────── */

  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'open').length;
  const totalApplications = Object.values(applicationsCount).reduce(
    (sum, c) => sum + c,
    0
  );

  /* ───────── Main Render ───────── */

  return (
    <section className="page">
      <header className="page-header">
        <h1>Employer Dashboard</h1>
        <p className="page-subtitle">
          Overview of your job postings and applicants.
        </p>
      </header>

      {/* ───── Stats ───── */}
      <div className="application-header">
        <div className="project-card">
          <h3>{totalJobs}</h3>
          <p>Total jobs posted</p>
        </div>

        <div className="project-card">
          <h3>{openJobs}</h3>
          <p>Open positions</p>
        </div>

        <div className="project-card">
          <h3>{totalApplications}</h3>
          <p>Total applications</p>
        </div>
      </div>

      {/* ───── Jobs list ───── */}
      <h2 style={{ marginTop: '2rem' }}>Your Jobs</h2>

      {jobs.length === 0 && (
        <p>You haven’t posted any jobs yet.</p>
      )}

      <div className="jobs-list">
        {jobs.map(job => (
          <article key={job.id} className="project-card">
            <h3>{job.title}</h3>

            <p className="job-meta">
              Status:{' '}
              <strong style={{ textTransform: 'capitalize' }}>
                {job.status}
              </strong>
            </p>

            <p className="job-meta">
              Applicants: {applicationsCount[job.id] || 0}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/jobs-portal/employer/jobs/${job.id}`}
                className="btn btn-ghost-sm"
              >
                View applicants
              </Link>

              <Link
                to="/jobs-portal/post"
                className="btn btn-ghost-sm"
              >
                Post another job
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default JobDashboard;
