// src/pages/FreelancerProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { upsertMyFreelancerProfile } from '../api/freelancers.js';

function FreelancerProfileSetup() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    overview: '',
    hourlyRate: '',
    location: '',
    skills: '',
    jobsCompleted: '',
    hoursWorked: '',
    jobSuccess: '',
    memberSince: '',
    exp1Role: '',
    exp1Company: '',
    exp1Period: '',
    exp1Summary: '',
    exp2Role: '',
    exp2Company: '',
    exp2Period: '',
    exp2Summary: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <section className="page page-form">
        <h1>Complete your freelancer profile</h1>
        <p>You need to log in as a freelancer to complete your profile.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (user.role !== 'freelancer') {
    return (
      <section className="page page-form">
        <h1>Complete your freelancer profile</h1>
        <p>This page is only for freelancer accounts.</p>
        <Link to="/" className="btn btn-primary">
          Go home
        </Link>
      </section>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const experiences = [];
      if (form.exp1Role && form.exp1Company) {
        experiences.push({
          role: form.exp1Role,
          company: form.exp1Company,
          period: form.exp1Period || '',
          summary: form.exp1Summary || '',
        });
      }
      if (form.exp2Role && form.exp2Company) {
        experiences.push({
          role: form.exp2Role,
          company: form.exp2Company,
          period: form.exp2Period || '',
          summary: form.exp2Summary || '',
        });
      }

      const payload = {
        title: form.title,
        overview: form.overview,
        hourlyRate: Number(form.hourlyRate),
        currency: 'USD',
        location: form.location,
        skills: skillsArray,
        stats: {
          jobsCompleted: Number(form.jobsCompleted) || 0,
          hoursWorked: Number(form.hoursWorked) || 0,
          jobSuccess: Number(form.jobSuccess) || 0,
          memberSince: form.memberSince || '',
        },
        experiences,
      };

      await upsertMyFreelancerProfile(payload, token);

      // After completing profile, go to homepage
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to save your profile. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page page-form">
      <div className="form-layout">
        <div className="form-main">
          <header className="page-header">
            <h1>Complete your freelancer profile</h1>
            <p>
              Tell clients who you are, what you do, and what kind of projects
              you&apos;re looking for.
            </p>
          </header>

          <form className="form-card" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Professional title</span>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Full-stack JavaScript Developer"
              />
            </label>

            <label className="form-field">
              <span>Overview</span>
              <textarea
                name="overview"
                rows="5"
                required
                value={form.overview}
                onChange={handleChange}
                placeholder="Summarize your experience, strengths, and the kind of work you do best..."
              />
            </label>

            <div className="form-row">
              <label className="form-field">
                <span>Hourly rate (USD)</span>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="1"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                />
              </label>

              <label className="form-field">
                <span>Location</span>
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote · UTC+5:30"
                />
              </label>
            </div>

            <label className="form-field">
              <span>Skills</span>
              <input
                type="text"
                name="skills"
                required
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB, Docker"
              />
              <small style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Separate skills with commas.
              </small>
            </label>

            <h2 className="section-title">Stats</h2>

            <div className="form-row">
              <label className="form-field">
                <span>Jobs completed</span>
                <input
                  type="number"
                  name="jobsCompleted"
                  min="0"
                  value={form.jobsCompleted}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                />
              </label>

              <label className="form-field">
                <span>Hours worked</span>
                <input
                  type="number"
                  name="hoursWorked"
                  min="0"
                  value={form.hoursWorked}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                />
              </label>
            </div>

            <div className="form-row">
              <label className="form-field">
                <span>Job success (%)</span>
                <input
                  type="number"
                  name="jobSuccess"
                  min="0"
                  max="100"
                  value={form.jobSuccess}
                  onChange={handleChange}
                  placeholder="e.g. 95"
                />
              </label>

              <label className="form-field">
                <span>Member since</span>
                <input
                  type="text"
                  name="memberSince"
                  value={form.memberSince}
                  onChange={handleChange}
                  placeholder="e.g. 2022"
                />
              </label>
            </div>

            <h2 className="section-title">Experience</h2>

            <div className="details-card" style={{ padding: 0, border: 'none' }}>
              <div className="form-row">
                <label className="form-field">
                  <span>Role</span>
                  <input
                    type="text"
                    name="exp1Role"
                    value={form.exp1Role}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </label>
                <label className="form-field">
                  <span>Company</span>
                  <input
                    type="text"
                    name="exp1Company"
                    value={form.exp1Company}
                    onChange={handleChange}
                    placeholder="e.g. SaaSly"
                  />
                </label>
              </div>
              <label className="form-field">
                <span>Period</span>
                <input
                  type="text"
                  name="exp1Period"
                  value={form.exp1Period}
                  onChange={handleChange}
                  placeholder="e.g. 2021 – Present"
                />
              </label>
              <label className="form-field">
                <span>Summary</span>
                <textarea
                  name="exp1Summary"
                  rows="3"
                  value={form.exp1Summary}
                  onChange={handleChange}
                  placeholder="Describe what you worked on and your impact..."
                />
              </label>
            </div>

            <div className="details-card" style={{ padding: 0, border: 'none' }}>
              <div className="form-row">
                <label className="form-field">
                  <span>Role (optional)</span>
                  <input
                    type="text"
                    name="exp2Role"
                    value={form.exp2Role}
                    onChange={handleChange}
                    placeholder="Another role"
                  />
                </label>
                <label className="form-field">
                  <span>Company (optional)</span>
                  <input
                    type="text"
                    name="exp2Company"
                    value={form.exp2Company}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </label>
              </div>
              <label className="form-field">
                <span>Period</span>
                <input
                  type="text"
                  name="exp2Period"
                  value={form.exp2Period}
                  onChange={handleChange}
                  placeholder="e.g. 2018 – 2021"
                />
              </label>
              <label className="form-field">
                <span>Summary</span>
                <textarea
                  name="exp2Summary"
                  rows="3"
                  value={form.exp2Summary}
                  onChange={handleChange}
                  placeholder="Describe this role (optional)..."
                />
              </label>
            </div>

            {error && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? 'Saving profile...' : 'Save profile and continue'}
            </button>
          </form>
        </div>

        <aside className="form-sidebar">
          <div className="sidebar-card">
            <h3>Why complete your profile?</h3>
            <ul className="details-list">
              <li>Clients are more likely to hire freelancers with complete profiles.</li>
              <li>Your title, overview, and skills help you appear in relevant searches.</li>
              <li>Experience and stats build trust with new clients.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default FreelancerProfileSetup;
