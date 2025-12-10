// src/pages/BrowseFreelancers.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listFreelancers } from '../api/freelancers.js';
import { useAuth } from '../context/AuthContext.jsx';

function BrowseFreelancers() {
  const { token } = useAuth();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFreelancers() {
      setError(null);
      setLoading(true);
      try {
        const data = await listFreelancers(token);
        setFreelancers(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load freelancers.');
      } finally {
        setLoading(false);
      }
    }

    loadFreelancers();
  }, [token]);

  return (
    <section className="page page-freelancers">
      <header className="page-header">
        <h1>Browse Freelancers</h1>
        <p>Hire top talent from around the world.</p>
      </header>

      {loading && <p>Loading freelancers...</p>}
      {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

      {!loading && !error && freelancers.length === 0 && (
        <p>No freelancers available yet.</p>
      )}

      <div className="cards-grid">
        {freelancers.map((f) => (
          <article key={f.id} className="freelancer-card">
            <div className="freelancer-header">
              <div className="avatar-placeholder">
                {f.name.charAt(0)}
              </div>
              <div>
                <h3>{f.name}</h3>
                <p className="freelancer-title">{f.title}</p>
              </div>
            </div>
            <p className="freelancer-meta">
              {f.rate} · {f.location}
            </p>
            <div className="tags">
              {(f.skills || []).slice(0, 4).map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
            <Link
              to={`/freelancers/${f.id}`}
              className="btn btn-ghost-sm"
            >
              View profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BrowseFreelancers;
