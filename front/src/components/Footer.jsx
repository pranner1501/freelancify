import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">★</span>
            <span className="logo-text">Freelancify</span>
          </div>
          <p className="footer-tagline">
            A modern marketplace for remote work. Hire talent and get work done.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>For Clients</h4>
            <Link to="/projects" className="footer-link">
              Post a Project
            </Link>
            <Link to="/freelancers" className="footer-link">
              Browse Freelancers
            </Link>
          </div>
          <div>
            <h4>For Freelancers</h4>
            <Link to="/projects" className="footer-link">
              Browse Projects
            </Link>
            <Link to="/signup" className="footer-link">
              Create Account
            </Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#" className="footer-link">
              About
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Freelancify. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
