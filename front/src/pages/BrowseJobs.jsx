// src/pages/BrowseJobs.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listJobs } from '../api/jobs.js';
import { useAuth } from '../context/AuthContext.jsx';

function BrowseJobs() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Later: filters will work against real backend data.
  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await listJobs(token);
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [token]);
  return (
    <section className="page page-jobs">
      <header className="page-header">
        <h1>Browse Jobs</h1>
        <p>Find your next freelance project.</p>
      </header>

      <div className="jobs-layout">
        <aside className="filter-panel">
          <h2>Filters</h2>
          <div className="filter-group">
            <label>Search</label>
            <input type="text" placeholder="Search by keyword" />
          </div>
          <div className="filter-group">
            <label>Job type</label>
            <select>
              <option>Any</option>
              <option>Hourly</option>
              <option>Fixed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Experience level</label>
            <select>
              <option>Any</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full">Apply filters</button>
        </aside>

        <div className="jobs-list">
          {loading && <p>Loading jobs...</p>}
          {error && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
          )}
          {!loading && !error && jobs.length === 0 && (
            <p>No jobs found yet.</p>
          )}

          {jobs.map((job) => (
            <article key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p className="job-meta">
                {job.type} · {job.level} · {job.budget}
              </p>
              <div className="tags">
                {(job.tags || []).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/jobs/${job.id}`}
                className="btn btn-ghost-sm"
              >
                View details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseJobs;
