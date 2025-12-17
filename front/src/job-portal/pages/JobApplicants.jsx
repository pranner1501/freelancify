import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiGet } from '../../api/client.js';

function JobApplicants() {
  const { jobId } = useParams();
  const { user, token } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openResumeId, setOpenResumeId] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiGet(
          `/job-applications/job/${jobId}`,
          token
        );
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load applicants for this job.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId, user, token]);

  /* ───────── Guards ───────── */

  if (!user) {
    return (
      <section className="page">
        <h1>Job Applicants</h1>
        <p>You must be logged in as an employer to view applicants.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (user.role !== 'client') {
    return (
      <section className="page">
        <h1>Job Applicants</h1>
        <p>Only employer accounts can view job applicants.</p>
        <Link to="/jobs-portal/search" className="btn btn-primary">
          Browse jobs
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading applicants…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Job Applicants</h1>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        <Link to="/jobs-portal/employer" className="btn btn-primary">
          Back to posted jobs
        </Link>
      </section>
    );
  }

  /* ───────── Main Render ───────── */

  return (
    <section className="page">
      <header className="page-header">
        <h1>Applicants</h1>
        <p className="page-subtitle">
          Review candidates who applied to this job.
        </p>
      </header>

      {applications.length === 0 && (
        <p>No applicants have applied to this job yet.</p>
      )}

      <div className="applications-list">
        {applications.map((app) => {
          const isOpen = openResumeId === app.id;

          return (
            <article key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app.applicant?.fullName || 'Applicant'}</h3>
                <span className={`status-pill status-${app.status}`}>
                  {app.status}
                </span>
              </div>

              <p className="application-meta">
                {app.applicant?.email || ''}
              </p>

              <p className="application-meta">
                Applied on:{' '}
                {new Date(app.appliedAt).toLocaleDateString()}
              </p>

              <div className="application-cover">
                <strong>Cover letter</strong>
                <p>{app.coverLetter}</p>
              </div>

              {/* ───── Resume actions ───── */}
              {app.resumeUrl ? (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-ghost-sm"
                      onClick={() =>
                        setOpenResumeId(isOpen ? null : app.id)
                      }
                    >
                      {isOpen ? 'Hide resume' : 'Preview resume'}
                    </button>

                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost-sm"
                    >
                      Open resume
                    </a>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        height: '420px',
                      }}
                    >
                      <iframe
                        src={app.resumeUrl}
                        title="Resume preview"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="application-meta">
                  No resume uploaded
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/jobs-portal/employer" className="btn btn-ghost">
          ← Back to posted jobs
        </Link>
      </div>
    </section>
  );
}

export default JobApplicants;
