// src/pages/ApplyToJob.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobDetails, applyToJob } from '../api/jobs.js';
import { useAuth } from '../context/AuthContext.jsx';

function ApplyToJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [form, setForm] = useState({
    coverLetter: '',
    rateType: 'hourly',
    rateAmount: '',
    availability: 'Full-time',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await getJobDetails(jobId, token);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJob(false);
      }
    }

    loadJob();
  }, [jobId, token]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        rateAmount: Number(form.rateAmount),
      };
      await applyToJob(jobId, payload, token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <section className="page">
        <h1>Apply to job</h1>
        <p>You must be logged in to apply.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (loadingJob) {
    return (
      <section className="page">
        <p>Loading job...</p>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="page">
        <h1>Job not found</h1>
        <p>We couldn&apos;t find this job. It may have been removed.</p>
        <Link to="/jobs" className="btn btn-primary">
          Back to jobs
        </Link>
      </section>
    );
  }

  return (
    <section className="page page-form">
      <div className="form-layout">
        <div className="form-main">
          <header className="page-header">
            <h1>Apply to: {job.title}</h1>
            <p>
              {job.type} · {job.level} · {job.budget}
            </p>
          </header>

          <form className="form-card" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Cover letter</span>
              <textarea
                name="coverLetter"
                rows="6"
                required
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Explain why you are a great fit for this job..."
              />
            </label>

            <div className="form-row">
              <label className="form-field">
                <span>Rate type</span>
                <select
                  name="rateType"
                  value={form.rateType}
                  onChange={handleChange}
                >
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed price</option>
                </select>
              </label>

              <label className="form-field">
                <span>
                  {form.rateType === 'hourly' ? 'Hourly rate' : 'Total amount'}
                </span>
                <input
                  type="number"
                  name="rateAmount"
                  required
                  min="1"
                  value={form.rateAmount}
                  onChange={handleChange}
                  placeholder={form.rateType === 'hourly' ? 'e.g. 30' : 'e.g. 1500'}
                />
              </label>
            </div>

            <label className="form-field">
              <span>Availability</span>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Up to 20 hours/week</option>
              </select>
            </label>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit proposal'}
            </button>
          </form>
        </div>

        <aside className="form-sidebar">
          <div className="sidebar-card">
            <h3>Job summary</h3>
            <p className="sidebar-client-name">{job.title}</p>
            <p className="sidebar-client-location">
              {job.type} · {job.level}
            </p>
            <p className="sidebar-row">
              <span>Budget</span>
              <span>{job.budget}</span>
            </p>
            <p className="sidebar-row">
              <span>Project type</span>
              <span>{job.projectType}</span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ApplyToJob;
