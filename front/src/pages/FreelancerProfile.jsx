// src/pages/FreelancerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFreelancer, inviteFreelancer } from '../api/freelancers.js';
import { listMyJobs } from '../api/jobs.js';
import { useAuth } from '../context/AuthContext.jsx';

function FreelancerProfile() {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [freelancer, setFreelancer] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const [myJobs, setMyJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      setError(null);
      setLoadingProfile(true);
      try {
        const data = await getFreelancer(freelancerId, token);
        setFreelancer(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load freelancer profile.');
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [freelancerId, token]);

  // Load "my jobs" for clients so they can invite
  useEffect(() => {
    async function loadJobs() {
      if (!user || user.role !== 'client') return;

      setJobsLoading(true);
      setJobsError(null);
      try {
        const data = await listMyJobs(token);
        setMyJobs(data);
        if (data.length > 0) {
          setSelectedJobId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setJobsError('Failed to load your jobs.');
      } finally {
        setJobsLoading(false);
      }
    }

    loadJobs();
  }, [user, token]);

  async function handleInvite(event) {
    event.preventDefault();
    setInviteError(null);

    if (!user) {
      setInviteError('You must be logged in as a client to invite.');
      return;
    }
    if (user.role !== 'client') {
      setInviteError('Only clients can invite freelancers.');
      return;
    }
    if (!selectedJobId) {
      setInviteError('Please select a job to invite to.');
      return;
    }

    try {
      setInviting(true);
      const result = await inviteFreelancer(freelancerId, selectedJobId, token);
      navigate(`/messages/${result.threadId}`);
    } catch (err) {
      console.error(err);
      setInviteError('Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  }

  if (loadingProfile) {
    return (
      <section className="page profile-page">
        <p>Loading profile...</p>
      </section>
    );
  }

  if (error || !freelancer) {
    return (
      <section className="page profile-page">
        <h1>Freelancer not found</h1>
        <p>{error || 'This profile may no longer be available.'}</p>
        <Link to="/freelancers" className="btn btn-primary">
          Back to freelancers
        </Link>
      </section>
    );
  }

  return (
    <section className="page profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          {freelancer.name.charAt(0)}
        </div>
        <div>
          <h1>{freelancer.name}</h1>
          <p className="profile-title">{freelancer.title}</p>
          <p className="profile-meta">
            {freelancer.rate} · {freelancer.location}
          </p>
          <div className="profile-chips">
            <span className="chip">
              {freelancer.stats.jobSuccess} job success
            </span>
            <span className="chip">
              {freelancer.stats.jobsCompleted} jobs completed
            </span>
            <span className="chip">
              {freelancer.stats.hoursWorked} hours worked
            </span>
          </div>
        </div>
      </header>

      <div className="details-layout profile-layout">
        <div className="details-main">
          <section className="details-card">
            <h2 className="section-title">Overview</h2>
            <p className="details-text">{freelancer.overview}</p>
          </section>

          <section className="details-card">
            <h2 className="section-title">Experience</h2>
            <ul className="details-list">
              {freelancer.experiences.map((exp) => (
                <li key={exp.role + exp.company}>
                  <p className="exp-role">{exp.role}</p>
                  <p className="exp-company">{exp.company}</p>
                  <p className="exp-period">{exp.period}</p>
                  <p className="exp-summary">{exp.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="details-sidebar">
          <div className="sidebar-card">
            <h3>Skills</h3>
            <div className="tags">
              {freelancer.skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Profile info</h3>
            <p className="sidebar-row">
              <span>Member since</span>
              <span>{freelancer.stats.memberSince}</span>
            </p>
            <p className="sidebar-row">
              <span>Jobs completed</span>
              <span>{freelancer.stats.jobsCompleted}</span>
            </p>
            <p className="sidebar-row">
              <span>Hours worked</span>
              <span>{freelancer.stats.hoursWorked}</span>
            </p>
          </div>

          <div className="sidebar-card">
            <h3>Invite to job</h3>

            {!user && (
              <p style={{ fontSize: '0.9rem' }}>
                Log in as a client to invite this freelancer to a job.
              </p>
            )}

            {user && user.role !== 'client' && (
              <p style={{ fontSize: '0.9rem' }}>
                Only client accounts can invite freelancers.
              </p>
            )}

            {user && user.role === 'client' && (
              <form onSubmit={handleInvite} className="auth-form">
                {jobsLoading && <p>Loading your jobs...</p>}
                {jobsError && (
                  <p style={{ color: 'red', fontSize: '0.85rem' }}>
                    {jobsError}
                  </p>
                )}

                {!jobsLoading && myJobs.length === 0 && !jobsError && (
                  <p style={{ fontSize: '0.85rem' }}>
                    You have no jobs yet. <Link to="/jobs/new">Post a job</Link>{' '}
                    first to invite freelancers.
                  </p>
                )}

                {!jobsLoading && myJobs.length > 0 && (
                  <>
                    <label className="form-field">
                      <span>Select a job</span>
                      <select
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                      >
                        {myJobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    {inviteError && (
                      <p style={{ color: 'red', fontSize: '0.85rem' }}>
                        {inviteError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-full"
                      disabled={inviting}
                    >
                      {inviting ? 'Sending invite...' : 'Invite to job'}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

          <div className="sidebar-backlink">
            <Link to="/freelancers" className="btn btn-ghost btn-full">
              ← Back to freelancers
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default FreelancerProfile;
