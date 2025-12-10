// src/pages/PostJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api/jobs.js';
import { useAuth } from '../context/AuthContext.jsx';

function PostJob() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectType: 'Ongoing project',
    budgetType: 'hourly',
    budgetAmount: '',
    level: 'Intermediate',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
        budgetAmount: Number(form.budgetAmount),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await createJob(payload, token);
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to post job.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user || user.role !== 'client') {
    return (
      <section className="page">
        <h1>Post a job</h1>
        <p>You must be logged in as a client to post jobs.</p>
      </section>
    );
  }

  return (
    <section className="page page-form">
      <div className="form-layout">
        <div className="form-main">
          <header className="page-header">
            <h1>Post a new job</h1>
            <p>Describe the work you want done and find the right freelancer.</p>
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
                placeholder="e.g. React developer for dashboard project"
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
                placeholder="Describe the project, expectations, and any specific requirements..."
              />
            </label>

            <div className="form-row">
              <label className="form-field">
                <span>Project type</span>
                <select
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                >
                  <option>Ongoing project</option>
                  <option>One-time project</option>
                  <option>Short term</option>
                </select>
              </label>

              <label className="form-field">
                <span>Experience level</span>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label className="form-field">
                <span>Budget type</span>
                <select
                  name="budgetType"
                  value={form.budgetType}
                  onChange={handleChange}
                >
                  <option value="hourly">Hourly</option>
                  <option value="fixed">Fixed price</option>
                </select>
              </label>

              <label className="form-field">
                <span>
                  {form.budgetType === 'hourly'
                    ? 'Hourly range (approx)'
                    : 'Total budget'}
                </span>
                <input
                  type="number"
                  name="budgetAmount"
                  required
                  min="1"
                  value={form.budgetAmount}
                  onChange={handleChange}
                  placeholder={form.budgetType === 'hourly' ? 'e.g. 25' : 'e.g. 1500'}
                />
              </label>
            </div>

            <label className="form-field">
              <span>Skills / tags</span>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, CSS"
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

        <aside className="form-sidebar">
          <div className="sidebar-card">
            <h3>Good job posts include</h3>
            <ul className="details-list">
              <li>Clear description of the outcome you want.</li>
              <li>Any tech stack or tools you require.</li>
              <li>Expected timelines and availability.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PostJob;
