// src/pages/ProjectDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetails } from '../api/projects.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProjectDetails() {
  const { projectId } = useParams();
  const { user, token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProjectDetails(projectId, token);
        setProject(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load project.');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId, token]);

  if (loading) {
    return (
      <section className="page project-details">
        <p>Loading project...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page project-details">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="page project-details">
        <h1>Project not found</h1>
        <p>This project may have been removed or is not available.</p>
        <Link to="/projects" className="btn btn-primary">
          Back to projects
        </Link>
      </section>
    );
  }

  return (
    <section className="page project-details">
      <header className="page-header">
        <h1>{project.title}</h1>
        <p className="project-details-meta">
          {project.type} · {project.level} · {project.budget}
        </p>
      </header>

      <div className="details-layout">
        <div className="details-main">
          <section className="details-card">
            <h2 className="section-title">Project description</h2>
            <p className="details-text">{project.description}</p>
          </section>

          <section className="details-card">
            <h2 className="section-title">Responsibilities</h2>
            <ul className="details-list">
              {(project.responsibilities || []).length === 0 && (
                <li>Responsibilities will be discussed with shortlisted freelancers.</li>
              )}
              {(project.responsibilities || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="details-card">
            <h2 className="section-title">Skills & expertise</h2>
            <div className="tags">
              {(project.tags || []).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="details-sidebar">
          <div className="sidebar-card">
            <h3>Project details</h3>
            <p className="sidebar-row">
              <span>Project type</span>
              <span>{project.projectType}</span>
            </p>
            <p className="sidebar-row">
              <span>Budget</span>
              <span>{project.budget}</span>
            </p>
            <p className="sidebar-row">
              <span>Experience level</span>
              <span>{project.level}</span>
            </p>
          </div>

          <div className="sidebar-card">
            <h3>About the client</h3>
            <p className="sidebar-client-name">{project.client?.name}</p>
            <p className="sidebar-client-location">{project.client?.location}</p>
          </div>

          {project?.client?.id !== user?.id && (
            <div className="sidebar-card">
              <h3>Next Steps</h3>
              <Link
                to={`/projects/${project.id}/apply`}
                className="btn btn-primary btn-full"
              >
                Apply to this project
              </Link>
            </div>
          )}


          <div className="sidebar-backlink">
            <Link to="/projects" className="btn btn-ghost btn-full">
              ← Back to project list
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ProjectDetails;
