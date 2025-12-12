// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'freelancer',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const createdUser = await signup(form);
      if (createdUser.role === 'freelancer') {
        // Go to profile completion first
        navigate('/freelancer/setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to sign up. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page page-auth">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Join as a client or a freelancer.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Alex Johnson"
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
            />
          </label>

          <label className="form-field">
            <span>I am a</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </label>

          {error && (
            <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="auth-alt-text">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </section>
  );
}

export default Signup;
