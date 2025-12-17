import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiPost } from '../../api/client.js';

function PostJob() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    organisation: '',
    location: '',
    type: 'Full Time',
    level: 'Intermediate',
    salary: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiPost(
        '/jobs',
        {
          ...form,
          salary: Number(form.salary),
        },
        token
      );

      navigate('/jobs-portal/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ───────── Guards ───────── */

  if (!user) {
    return (
      <section className="page">
        <h1>Post job</h1>
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
        <h1>Post job</h1>
        <p>Only employer accounts can post jobs.</p>
        <Link to="/jobs-portal/search" className="btn btn-primary">
          Browse jobs
        </Link>
      </section>
    );
  }

  /* ───────── Main Render ───────── */

  return (
    <section className="app-main">
      <div className="form-main">
        <header className="page-header">
          <h1>Post a new job</h1>
          <p>
            Describe the role and find the right candidate for your organisation.
          </p>
        </header>

        <form className="form-card" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Job title</span>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Senior React Engineer"
            />
          </label>

          <label className="form-field">
            <span>Job description</span>
            <textarea
              name="description"
              rows="6"
              required
              value={form.description}
              onChange={handleChange}
              placeholder="Describe responsibilities, expectations, and role requirements..."
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              <span>Job type</span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>

            <label className="form-field">
              <span>Experience level</span>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                <option>Junior</option>
                <option>Intermediate</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span>Organisation</span>
              <input
                type="text"
                name="organisation"
                value={form.organisation}
                onChange={handleChange}
                placeholder="e.g. Freelancify Inc"
              />
            </label>

            <label className="form-field">
              <span>Location</span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Remote / City"
              />
            </label>
          </div>

          <label className="form-field">
            <span>Salary (annual / monthly)</span>
            <input
              type="number"
              name="salary"
              required
              min="1"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
            />
          </label>

          {error && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post job'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PostJob;
