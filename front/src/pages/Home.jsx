// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Home() {
  const { user } = useAuth();

  let heading = 'Get work done with top freelancers.';
  let subtitle =
    'Post projects, hire trusted freelancers, and manage your projects in one place.';
  let primaryLink = '/signup';
  let primaryText = 'Get started';
  let secondaryLink = '/projects';
  let secondaryText = 'Browse projects';

  if (user && user.role === 'client') {
    heading = 'Hire the right freelancer for every project.';
    subtitle =
      'Post projects, review proposals, and chat with talent in one simple workspace.';
    primaryLink = '/projects/new';
    primaryText = 'Post a project';
    secondaryLink = '/freelancers';
    secondaryText = 'Browse freelancers';
  } else if (user && user.role === 'freelancer') {
    heading = 'Find high-quality freelance work.';
    subtitle =
      'Complete your profile, apply to projects that fit your skills, and build long-term client relationships.';
    primaryLink = '/projects';
    primaryText = 'Find projects';
    secondaryLink = '/freelancer/setup';
    secondaryText = 'Edit profile';
  }

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-main">
          <h1>{heading}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <div className="hero-actions">
            <Link to={primaryLink} className="btn btn-primary">
              {primaryText}
            </Link>
            <Link to={secondaryLink} className="btn btn-ghost">
              {secondaryText}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">10k+</span>
              <span className="hero-stat-label">Projects posted</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">5k+</span>
              <span className="hero-stat-label">Freelancers</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">4.8/5</span>
              <span className="hero-stat-label">Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-card">
            <h2>How it works</h2>
            <ul className="details-list">
              <li>Clients post projects with clear requirements and budgets.</li>
              <li>Freelancers apply with tailored proposals.</li>
              <li>Both sides chat, collaborate, and complete projects.</li>
            </ul>
          </div>

          <div className="hero-card">
            <h2>Popular categories</h2>
            <div className="tags">
              <span className="tag">Web Development</span>
              <span className="tag">UI/UX Design</span>
              <span className="tag">Backend APIs</span>
              <span className="tag">Mobile Apps</span>
              <span className="tag">Data &amp; Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
