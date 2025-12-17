import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function JobNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/jobs-portal" className="navbar-logo">
        <span className="logo-icon">★</span> 
        <span className="logo-text">Freelancify<b>Jobs</b></span>
        </Link>

        <nav className="navbar-links">
          {/* APPLICANT */}
          {user && user.role !== 'client' && (
            <>
              <NavLink
                to="/jobs-portal/search"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Search Jobs
              </NavLink>

              <NavLink
                to="/jobs-portal/applications"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                My Applications
              </NavLink>

              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Messages
              </NavLink>
            </>
          )}

          {/* EMPLOYER */}
          {user && user.role === 'client' && (
            <>
              <NavLink
                to="/jobs-portal/posted"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Posted Jobs
              </NavLink>

              <NavLink
                to="/jobs-portal/post"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Post Job
              </NavLink>

              <NavLink
                to="/jobs-portal/dashboard"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' nav-link-active' : '')
                }
              >
                Messages
              </NavLink>
            </>
          )}

          {/* AUTH */}
          {user ? (
            <button onClick={handleLogout} className="btn btn-ghost-sm">
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
