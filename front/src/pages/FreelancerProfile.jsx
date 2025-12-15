// src/pages/FreelancerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFreelancer, inviteFreelancer } from '../api/freelancers.js';
import { listMyProjects } from '../api/projects.js';
import { useAuth } from '../context/AuthContext.jsx';

function FreelancerProfile() {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [freelancer, setFreelancer] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  const [myProjects, setMyProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
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

  // Load "my projects" for clients so they can invite
  useEffect(() => {
    async function loadProjects() {
      if (!user || user.role !== 'client') return;

      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const data = await listMyProjects(token);
        setMyProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setProjectsError('Failed to load your projects.');
      } finally {
        setProjectsLoading(false);
      }
    }

    loadProjects();
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
    if (!selectedProjectId) {
      setInviteError('Please select a project to invite to.');
      return;
    }

    try {
      setInviting(true);
      const result = await inviteFreelancer(freelancerId, selectedProjectId, token);
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
              {freelancer.stats.projectSuccess} project success
            </span>
            <span className="chip">
              {freelancer.stats.projectsCompleted} projects completed
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
              <span>Projects completed</span>
              <span>{freelancer.stats.projectsCompleted}</span>
            </p>
            <p className="sidebar-row">
              <span>Hours worked</span>
              <span>{freelancer.stats.hoursWorked}</span>
            </p>
          </div>

          <div className="sidebar-card">
            <h3>Invite to project</h3>

            {!user && (
              <p style={{ fontSize: '0.9rem' }}>
                Log in as a client to invite this freelancer to a project.
              </p>
            )}

            {user && user.role !== 'client' && (
              <p style={{ fontSize: '0.9rem' }}>
                Only client accounts can invite freelancers.
              </p>
            )}

            {user && user.role === 'client' && (
              <form onSubmit={handleInvite} className="auth-form">
                {projectsLoading && <p>Loading your projects...</p>}
                {projectsError && (
                  <p style={{ color: 'red', fontSize: '0.85rem' }}>
                    {projectsError}
                  </p>
                )}

                {!projectsLoading && myProjects.length === 0 && !projectsError && (
                  <p style={{ fontSize: '0.85rem' }}>
                    You have no projects yet. <Link to="/projects/new">Post a project</Link>{' '}
                    first to invite freelancers.
                  </p>
                )}

                {!projectsLoading && myProjects.length > 0 && (
                  <>
                    <label className="form-field">
                      <span>Select a project</span>
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                      >
                        {myProjects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
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
                      {inviting ? 'Sending invite...' : 'Invite to project'}
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
