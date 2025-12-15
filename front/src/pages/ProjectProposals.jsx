// src/pages/ProjectProposals.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectProposals, getProjectDetails } from '../api/projects.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProjectProposals() {
  const { projectId } = useParams();
  const { user, token } = useAuth();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try{
        // Load project details (for header) and proposals
        const [projectDetails, proposalsData] = await Promise.all([
          getProjectDetails(projectId, token),
          getProjectProposals(projectId, token),
        ]);

        setProject(projectDetails);
        setProposals(proposalsData.proposals || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load proposals for this project.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId, token, user]);

  if (!user) {
    return (
      <section className="page">
        <h1>Project proposals</h1>
        <p>You must be logged in as a client to view proposals.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </section>
    );
  }

  if (user.role !== 'client') {
    return (
      <section className="page">
        <h1>Project proposals</h1>
        <p>Only client accounts can view proposals for their projects.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading proposals...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Project proposals</h1>
        <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="page">
        <h1>Project not found</h1>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Proposals for: {project.title}</h1>
        <p className="project-details-meta">
          {project.type} · {project.level} · {project.budget}
        </p>
      </header>

      {proposals.length === 0 && (
        <p>No proposals yet for this project.</p>
      )}

      <div className="proposals-list">
        {proposals.map((p) => (
            <Link to={`/projects/${project.id}/proposals/${p.id}`} >
            <article key={p.id} className="proposal-card">
            <div className="proposal-header">
              <h3>{p.freelancerName}</h3>
              <span className="proposal-rate">
                {p.rateType === 'hourly'
                  ? `$${p.rateAmount}/hr`
                  : `$${p.rateAmount} fixed`}
              </span>
            </div>
            <p className="proposal-meta">
              Availability: {p.availability} · Status: {p.status}
            </p>
            <p className="proposal-cover">{p.coverLetter}</p>
          </article></Link>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/projects" className="btn btn-ghost">
          ← Back to projects
        </Link>
      </div>
    </section>
  );
}

export default ProjectProposals;