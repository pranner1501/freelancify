import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-text">
          <h1>Hire the best freelancers for any job, online.</h1>
          <p>
            Browse thousands of jobs and freelancers across development, design,
            writing, marketing, and more.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary">
              Find Work
            </Link>
            <Link to="/freelancers" className="btn btn-outline">
              Hire Talent
            </Link>
          </div>
          <p className="hero-stats">
            <span>✔ Trusted by teams worldwide</span>
            <span>✔ Secure payments</span>
            <span>✔ Built for remote work</span>
          </p>
        </div>

        <div className="hero-card">
          <h2>Top categories</h2>
          <ul>
            <li>💻 Web & Mobile Development</li>
            <li>🎨 Design & Creative</li>
            <li>✍ Content Writing</li>
            <li>📢 Digital Marketing</li>
            <li>📊 Data & Analytics</li>
          </ul>
        </div>
      </div>

      <section className="home-section">
        <h2>Popular jobs</h2>
        <div className="cards-grid">
          {/* Static mock data; later we’ll load from backend */}
          <article className="job-card">
            <h3>Full-stack React developer needed</h3>
            <p className="job-meta">Fixed price · Intermediate · Remote</p>
            <p className="job-desc">
              Build a modern web app for managing internal workflows and
              dashboards.
            </p>
            <button className="btn btn-ghost-sm">View details</button>
          </article>

          <article className="job-card">
            <h3>Landing page design for SaaS product</h3>
            <p className="job-meta">Hourly · Expert · Remote</p>
            <p className="job-desc">
              Design a high-converting landing page following our brand system.
            </p>
            <button className="btn btn-ghost-sm">View details</button>
          </article>

          <article className="job-card">
            <h3>Technical blog writer (long term)</h3>
            <p className="job-meta">Monthly · Intermediate · Remote</p>
            <p className="job-desc">
              Looking for a writer who understands web development and DevOps.
            </p>
            <button className="btn btn-ghost-sm">View details</button>
          </article>
        </div>
      </section>
    </section>
  );
}

export default Home;
