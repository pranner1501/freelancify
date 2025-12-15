// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">★</span>
          <span className="logo-text">Freelancify</span>
        </Link>

        <nav className="navbar-links">
          {/* <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Home
          </NavLink> */}
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/freelancers"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Find Freelancers
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Messages
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {user && user.role === 'client' && (
            <Link to="/projects/new" className="btn btn-outline">
              Post a project
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/dashboard" className="btn btn-ghost">
                {user.fullName.split(' ')[0] || 'Dashboard'}
              </Link>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
