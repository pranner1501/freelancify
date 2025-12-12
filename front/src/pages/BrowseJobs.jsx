// src/pages/BrowseJobs.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listJobs,
  listExploreJobs,
  listMyJobs, 
  listAssignedJobs,
} from '../api/jobs.js';
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

function BrowseJobs() {
  const { user, token } = useAuth();
  const isClient = user && user.role === 'client';
  const isFreelancer = user && user.role === 'freelancer';

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my' | 'current' | 'proposals'

  // Explore / My (client) state
  const [exploreJobs, setExploreJobs] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [exploreError, setExploreError] = useState(null);

  const [myJobs, setMyJobs] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState(null);

  // Freelancer-specific state
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState(null);

  const [myProposals, setMyProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalsError, setProposalsError] = useState(null);

  // Load explore jobs
  useEffect(() => {
    async function loadExplore() {
      setExploreLoading(true);
      setExploreError(null);
      try {
        let data;
        if (isClient) {
          data = await listExploreJobs(token);
        } else {
          data = await listJobs(token);
        }
        setExploreJobs(data);
      } catch (err) {
        console.error(err);
        setExploreError('Failed to load projects.');
      } finally {
        setExploreLoading(false);
      }
    }

    loadExplore();
  }, [isClient, token]);

  // Load my jobs when client selects 'my' tab
  useEffect(() => {
    async function loadMyJobs() {
      if (!isClient || activeTab !== 'my') return;
      setMyLoading(true);
      setMyError(null);
      try {
        const data = await listMyJobs(token);
        setMyJobs(data);
      } catch (err) {
        console.error(err);
        setMyError('Failed to load your projects.');
      } finally {
        setMyLoading(false);
      }
    }
    loadMyJobs();
  }, [isClient, activeTab, token]);

  // Load assigned jobs for freelancer when 'current' selected
  useEffect(() => {
    async function loadAssigned() {
      if (!isFreelancer || activeTab !== 'current') return;
      setAssignedLoading(true);
      setAssignedError(null);
      try {
        const data = await listAssignedJobs(token);
        setAssignedJobs(data);
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
    <section className="page page-jobs">
      <header className="page-header">
        <h1>Browse Projects</h1>
        <p>Find new work or manage your existing projects.</p>
      </header>

      <div className="jobs-tabs">
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
              Current Jobs
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
        <div className="jobs-layout">
          <aside className="filter-panel">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>Search</label>
              <input type="text" placeholder="Search by keyword" />
            </div>
            <div className="filter-group">
              <label>Job type</label>
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

          <div className="jobs-list">
            {exploreLoading && <p>Loading projects...</p>}
            {exploreError && (
              <p style={{ color: 'red', fontSize: '0.9rem' }}>
                {exploreError}
              </p>
            )}
            {!exploreLoading && !exploreError && exploreJobs.length === 0 && (
              <p>No projects found.</p>
            )}

            {exploreJobs.map((job) => (
              <article key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p className="job-meta">
                  {job.type} · {job.level} · {job.budget}
                </p>
                <div className="tags">
                  {(job.tags || []).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/jobs/${job.id}`}
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
        <div className="jobs-my">
          {myLoading && <p>Loading your projects...</p>}
          {myError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{myError}</p>
          )}
          {!myLoading && !myError && myJobs.length === 0 && (
            <p>
              You haven&apos;t posted any projects yet.{' '}
              <Link to="/jobs/new">Post a job</Link> to get started.
            </p>
          )}

          <div className="jobs-list">
            {myJobs.map((job) => (
              <article key={job.id} className="job-card job-card-my">
                <div className="job-header-row">
                  <h3>{job.title}</h3>
                  <span className="status-pill">
                    {formatStatus(job.status)}
                  </span>
                </div>

                <p className="job-meta">
                  {job.type} · {job.level} · {job.budget}
                </p>

                <div className="job-my-stats">
                  <span>
                    Proposals: <strong>{job.proposalsCount}</strong>
                  </span>
                  <span>
                    Time remaining:{' '}
                    <strong>{formatTimeRemaining(job.deadline)}</strong>
                  </span>
                </div>

                <div className="job-my-actions">
                  <Link
                    to={`/jobs/${job.id}/manage`}
                    className="btn btn-ghost-sm"
                  >
                    Review proposals
                  </Link>
                  <Link
                    to={`/jobs/${job.id}`}
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
        <div className="jobs-current">
          {assignedLoading && <p>Loading your current projects...</p>}
          {assignedError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{assignedError}</p>
          )}

          {!assignedLoading && assignedJobs.length === 0 && (
            <p>You have no active projects right now.</p>
          )}

          <div className="jobs-list">
            {assignedJobs.map((a) => (
              <article key={a.jobId || a.proposalId} className="job-card job-card-assigned">
                <div className="job-header-row">
                  <h3>{a.title}</h3>
                  <span className="status-pill">{formatStatus(a.status)}</span>
                </div>

                <p className="job-meta">{a.budget}</p>

                <div className="job-my-stats">
                  <span>
                    Awarded: <strong>{new Date(a.awardedAt).toLocaleDateString()}</strong>
                  </span>
                  <span>
                    Time remaining: <strong>{formatTimeRemaining(a.deadline)}</strong>
                  </span>
                </div>

                <div className="job-my-actions">
                  <Link
                    to={`/jobs/${a.jobId}`}
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
        <div className="jobs-proposals">
          {proposalsLoading && <p>Loading your proposals...</p>}
          {proposalsError && (
            <p style={{ color: 'red', fontSize: '0.9rem' }}>{proposalsError}</p>
          )}

          {!proposalsLoading && myProposals.length === 0 && (
            <p>You have not submitted any proposals yet.</p>
          )}

          <div className="jobs-list">
            {myProposals.map((p) => (
              <article key={p.id} className="proposal-card">
                <div className="proposal-header">
                  <h3>{p.jobTitle || 'Job'}</h3>
                  <span className="status-pill">{p.status}</span>
                </div>

                <p className="proposal-meta">
                  Submitted: {new Date(p.createdAt).toLocaleDateString()}
                </p>

                <p className="proposal-cover">{p.coverLetter}</p>

                <div className="job-my-actions">
                  <Link
                    to={`/jobs/${p.jobId}`}
                    className="btn btn-ghost-sm"
                  >
                    View job
                  </Link>
                  <Link
                    to={`/jobs/${p.jobId}/proposals/${p.id}`}
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

export default BrowseJobs;
