import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page page-not-found">
      <div className="notfound-card">
        <h1>404</h1>
        <p>Sorry, we couldn&apos;t find that page.</p>
        <Link to="/" className="btn btn-primary">
          Go back home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
