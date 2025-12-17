import React from 'react';
import { Link } from 'react-router-dom';
export default function JobFooter() {
    return (
      <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">★</span>
            <span className="logo-text">Freelancify<b>Jobs</b></span>
          </div>
          <p className="footer-tagline">
            A modern marketplace for remote work. Hire talent and get work done.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h4>For Clients</h4>
            <Link to="/jobs-portal/post" className="footer-link">
              Post a Job
            </Link>
            <Link to="/jobs-portal/posted" className="footer-link">
              Browse Posts
            </Link>
          </div>
          <div>
            <h4>For jobs</h4>
            <Link to="/jobs-portal/search" className="footer-link">
              Browse Jobs
            </Link>
            <Link to="/jobs-portal/applications" className="footer-link">
              Job Applications
            </Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="/" className="footer-link">
              Freelancify
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
        </div>
        
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Freelancify Jobs. All rights reserved.</span>
      </div>
    </footer>
    );
  }
  
        