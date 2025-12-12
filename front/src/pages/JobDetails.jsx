// src/pages/JobDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobDetails } from '../api/jobs.js';
import { useAuth } from '../context/AuthContext.jsx';

function JobDetails() {
  const { jobId } = useParams();
  const { user, token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await getJobDetails(jobId, token);
        setJob(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job.');
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId, token]);

  if (loading) {
    return (
      <section className="page job-details">
        <p>Loading job...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page job-details">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/jobs" className="btn btn-primary">
          Back to jobs
        </Link>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="page job-details">
        <h1>Job not found</h1>
        <p>This job may have been removed or is not available.</p>
        <Link to="/jobs" className="btn btn-primary">
          Back to jobs
        </Link>
      </section>
    );
  }

  return (
    <section className="page job-details">
      <header className="page-header">
        <h1>{job.title}</h1>
        <p className="job-details-meta">
          {job.type} · {job.level} · {job.budget}
        </p>
      </header>

      <div className="details-layout">
        <div className="details-main">
          <section className="details-card">
            <h2 className="section-title">Job description</h2>
            <p className="details-text">{job.description}</p>
          </section>

          <section className="details-card">
            <h2 className="section-title">Responsibilities</h2>
            <ul className="details-list">
              {(job.responsibilities || []).length === 0 && (
                <li>Responsibilities will be discussed with shortlisted freelancers.</li>
              )}
              {(job.responsibilities || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="details-card">
            <h2 className="section-title">Skills & expertise</h2>
            <div className="tags">
              {(job.tags || []).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="details-sidebar">
          <div className="sidebar-card">
            <h3>Project details</h3>
            <p className="sidebar-row">
              <span>Project type</span>
              <span>{job.projectType}</span>
            </p>
            <p className="sidebar-row">
              <span>Budget</span>
              <span>{job.budget}</span>
            </p>
            <p className="sidebar-row">
              <span>Experience level</span>
              <span>{job.level}</span>
            </p>
          </div>

          <div className="sidebar-card">
            <h3>About the client</h3>
            <p className="sidebar-client-name">{job.client?.name}</p>
            <p className="sidebar-client-location">{job.client?.location}</p>
          </div>

          {job?.client?.id !== user?.id && (
            <div className="sidebar-card">
              <h3>Next Steps</h3>
              <Link
                to={`/jobs/${job.id}/apply`}
                className="btn btn-primary btn-full"
              >
                Apply to this job
              </Link>
            </div>
          )}


          <div className="sidebar-backlink">
            <Link to="/jobs" className="btn btn-ghost btn-full">
              ← Back to job list
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default JobDetails;
