// src/pages/ApplyToProject.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectDetails, applyToProject } from '../api/projects.js';
import { useAuth } from '../context/AuthContext.jsx';

function ApplyToProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [form, setForm] = useState({
    coverLetter: '',
    rateType: 'hourly',
    rateAmount: '',
    availability: 'Full-time',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProjectDetails(projectId, token);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProject(false);
      }
    }

    loadProject();
  }, [projectId, token]);

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
      await applyToProject(projectId, payload, token);
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
        <h1>Apply to project</h1>
        <p>You must be logged in to apply.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (loadingProject) {
    return (
      <section className="page">
        <p>Loading project...</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="page">
        <h1>Project not found</h1>
        <p>We couldn&apos;t find this project. It may have been removed.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  return (
    <section className="page page-form">
      <div className="form-layout">
        <div className="form-main">
          <header className="page-header">
            <h1>Apply to: {project.title}</h1>
            <p>
              {project.type} · {project.level} · {project.budget}
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
                placeholder="Explain why you are a great fit for this project..."
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
            <h3>Project summary</h3>
            <p className="sidebar-client-name">{project.title}</p>
            <p className="sidebar-client-location">
              {project.type} · {project.level}
            </p>
            <p className="sidebar-row">
              <span>Budget</span>
              <span>{project.budget}</span>
            </p>
            <p className="sidebar-row">
              <span>Project type</span>
              <span>{project.projectType}</span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ApplyToProject;
