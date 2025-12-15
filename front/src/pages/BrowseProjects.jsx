// src/pages/BrowseProjects.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listProjects,
  listExploreProjects,
  listMyProjects, 
  listAssignedProjects,
} from '../api/projects.js';
import { listMyProposals } from '../api/proposals.js';
import { useAuth } from '../context/AuthContext.jsx';

function formatTimeRemaining(deadline) {
  if (!deadline) return 'No deadline';

  const end = new Date(deadline);
  const now = new Date();

  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return 'Deadline passed';

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

function formatStatus(status) {
  if (!status) return 'Open';
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

function BrowseProjects() {
  const { user, token } = useAuth();
  const isClient = user && user.role === 'client';
  const isFreelancer = user && user.role === 'freelancer';

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my' | 'current' | 'proposals'

  // Explore / My (client) state
  const [exploreProjects, setExploreProjects] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [exploreError, setExploreError] = useState(null);

  const [myProjects, setMyProjects] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  // Freelancer-specific state
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState(null);

  const [myProposals, setMyProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalsError, setProposalsError] = useState(null);

  // Load explore projects
  useEffect(() => {
    async function loadExplore() {
      setExploreLoading(true);
      setExploreError(null);
      try {
        let data;
        if (isClient) {
          data = await listExploreProjects(token);
        } else {
          data = await listProjects(token);
        }
        setExploreProjects(data);
      } catch (err) {
        console.error(err);
        setExploreError('Failed to load projects.');
      } finally {
        setExploreLoading(false);
      }
    }

    loadExplore();
  }, [isClient, token]);

  // Load my projects when client selects 'my' tab
  useEffect(() => {
    async function loadMyProjects() {
      if (!isClient || activeTab !== 'my') return;
      setMyLoading(true);
      setMyError(null);
      try {
        const data = await listMyProjects(token);
        setMyProjects(data);
      } catch (err) {
        console.error(err);
        setMyError('Failed to load your projects.');
      } finally {
        setMyLoading(false);
      }
    }
    loadMyProjects();
  }, [isClient, activeTab, token]);

  // Load assigned projects for freelancer when 'current' selected
  useEffect(() => {
    async function loadAssigned() {
      if (!isFreelancer || activeTab !== 'current') return;
      setAssignedLoading(true);
      setAssignedError(null);
      try {
        const data = await listAssignedProjects(token);
        setAssignedProjects(data);
      } catch (err) {
        console.error(err);
        setAssignedError('Failed to load your current projects.');
      } finally {
        setAssignedLoading(false);
      }
    }
    loadAssigned();
  }, [isFreelancer, activeTab, token]);

  // Load proposals for freelancer when 'proposals' selected
  useEffect(() => {
    async function loadProposals() {
      if (!isFreelancer || activeTab !== 'proposals') return;
      setProposalsLoading(true);
      setProposalsError(null);
      try {
        const data = await listMyProposals(token);
        setMyProposals(data);
      } catch (err) {
        console.error(err);
        setProposalsError('Failed to load your proposals.');
      } finally {
        setProposalsLoading(false);
      }
    }
    loadProposals();
  }, [isFreelancer, activeTab, token]);

  return (
    <section className="page page-projects">
      <header className="page-header">
        <h1>Browse Projects</h1>
        <p>Find new work or manage your existing projects.</p>
      </header>

      <div className="projects-tabs">
        <button
          type="button"
          className={
            'tab-button' + (activeTab === 'explore' ? ' tab-button-active' : '')
          }
          onClick={() => setActiveTab('explore')}
        >
          Explore Projects
        </button>

        {isClient && (
          <button
            type="button"
            className={'tab-button' + (activeTab === 'my' ? ' tab-button-active' : '')}
            onClick={() => setActiveTab('my')}
          >
            My Projects
          </button>
        )}

        {isFreelancer && (
          <>
            <button
              type="button"
              className={
                'tab-button' + (activeTab === 'current' ? ' tab-button-active' : '')
              }
              onClick={() => setActiveTab('current')}
            >
              Current Projects
            </button>

            <button
              type="button"
              className={
                'tab-button' + (activeTab === 'proposals' ? ' tab-button-active' : '')
              }
              onClick={() => setActiveTab('proposals')}
            >
              Proposals
            </button>
          </>
        )}
      </div>

      {activeTab === 'explore' && (
        <div className="projects-layout">
          <aside className="filter-panel">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>Search</label>
              <input type="text" placeholder="Search by keyword" />
            </div>
            <div className="filter-group">
              <label>Project type</label>
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

          <div className="projects-list">
            {exploreLoading && <p>Loading projects...</p>}
            {exploreError && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>
                {exploreError}
              </p>
            )}
            {!exploreLoading && !exploreError && exploreProjects.length === 0 && (
              <p>No projects found.</p>
            )}

            {exploreProjects.map((project) => (
              <article key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p className="project-meta">
                  {project.type} · {project.level} · {project.budget}
                </p>
                <div className="tags">
                  {(project.tags || []).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="btn btn-ghost-sm"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my' && isClient && (
        <div className="projects-my">
          {myLoading && <p>Loading your projects...</p>}
          {myError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{myError}</p>
          )}
          {!myLoading && !myError && myProjects.length === 0 && (
            <p>
              You haven&apos;t posted any projects yet.{' '}
              <Link to="/projects/new">Post a project</Link> to get started.
            </p>
          )}

          <div className="projects-list">
            {myProjects.map((project) => (
              <article key={project.id} className="project-card project-card-my">
                <div className="project-header-row">
                  <h3>{project.title}</h3>
                  <span className="status-pill">
                    {formatStatus(project.status)}
                  </span>
                </div>

                <p className="project-meta">
                  {project.type} · {project.level} · {project.budget}
                </p>

                <div className="project-my-stats">
                  <span>
                    Proposals: <strong>{project.proposalsCount}</strong>
                  </span>
                  <span>
                    Time remaining:{' '}
                    <strong>{formatTimeRemaining(project.deadline)}</strong>
                  </span>
                </div>

                <div className="project-my-actions">
                  <Link
                    to={`/projects/${project.id}/manage`}
                    className="btn btn-ghost-sm"
                  >
                    Review proposals
                  </Link>
                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-ghost-sm"
                  >
                    View public page
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'current' && isFreelancer && (
        <div className="projects-current">
          {assignedLoading && <p>Loading your current projects...</p>}
          {assignedError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{assignedError}</p>
          )}

          {!assignedLoading && assignedProjects.length === 0 && (
            <p>You have no active projects right now.</p>
          )}

          <div className="projects-list">
            {assignedProjects.map((a) => (
              <article key={a.projectId || a.proposalId} className="project-card project-card-assigned">
                <div className="project-header-row">
                  <h3>{a.title}</h3>
                  <span className="status-pill">{formatStatus(a.status)}</span>
                </div>

                <p className="project-meta">{a.budget}</p>

                <div className="project-my-stats">
                  <span>
                    Awarded: <strong>{new Date(a.awardedAt).toLocaleDateString()}</strong>
                  </span>
                  <span>
                    Time remaining: <strong>{formatTimeRemaining(a.deadline)}</strong>
                  </span>
                </div>

                <div className="project-my-actions">
                  <Link
                    to={`/projects/${a.projectId}`}
                    className="btn btn-ghost-sm"
                  >
                    View public page
                  </Link>
                  <Link
                    to={`/messages`} // user will pick the conversation or open thread if you add mapping
                    className="btn btn-ghost-sm"
                  >
                    Open messages
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'proposals' && isFreelancer && (
        <div className="projects-proposals">
          {proposalsLoading && <p>Loading your proposals...</p>}
          {proposalsError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{proposalsError}</p>
          )}

          {!proposalsLoading && myProposals.length === 0 && (
            <p>You have not submitted any proposals yet.</p>
          )}

          <div className="projects-list">
            {myProposals.map((p) => (
              <article key={p.id} className="proposal-card">
                <div className="proposal-header">
                  <h3>{p.projectTitle || 'Project'}</h3>
                  <span className="status-pill">{p.status}</span>
                </div>

                <p className="proposal-meta">
                  Submitted: {new Date(p.createdAt).toLocaleDateString()}
                </p>

                <p className="proposal-cover">{p.coverLetter}</p>

                <div className="project-my-actions">
                  <Link
                    to={`/projects/${p.projectId}`}
                    className="btn btn-ghost-sm"
                  >
                    View project
                  </Link>
                  <Link
                    to={`/projects/${p.projectId}/proposals/${p.id}`}
                    className="btn btn-ghost-sm"
                  >
                    View proposal
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default BrowseProjects;
