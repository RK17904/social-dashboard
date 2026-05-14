import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldCheck, User } from 'lucide-react';
import axios from 'axios';

export default function Login({ onLogin }) {
  // State to control the sliding animation (Admin is now the right panel)
  const [isAdminView, setIsAdminView] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const toggleView = () => {
    setIsAdminView(!isAdminView);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleLoginSubmit = async (e, expectedRole) => {
  e.preventDefault();
  setError('');

  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }

  try {
    // Send the login attempt to your new Node.js backend route
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: email,
      password: password,
      role: expectedRole // Ensures an Admin can't log into the User portal, and vice versa!
    });

    // If the server responds with 200 OK, the login was successful!
    if (response.status === 200) {
      onLogin(expectedRole);
    }
  } catch (err) {
    // If the server says 401 Unauthorized, display the error message
    setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
  }
};

  return (
    <div className="auth-wrapper">
{/* 1. THE BACKGROUND VIDEO */}
      <video autoPlay loop muted playsInline className="auth-video-bg">
        <source src="/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. A SUBTLE DARK OVERLAY (Helps the glass card pop!) */}
      <div className="auth-video-overlay"></div>

      {/* 3. YOUR EXISTING LOGIN CARD */}
      <div className={`auth-container ${isAdminView ? 'right-panel-active' : ''} ${mounted ? 'mounted' : ''}`}>        
        {/* =========================================
            FORM 1: USER LOGIN (LEFT SIDE - DEFAULT)
            ========================================= */}
        <div className="auth-form-container user-container">
          <div className="auth-header">
            <User size={28} color="var(--accent-primary)" />
            <span>CLIENT PORTAL</span>
          </div>

          <h1>Hello User</h1>
          <p className="auth-subtitle">View your live analytics dashboard.</p>

          {error && !isAdminView && <div className="auth-error">{error}</div>}

          <form onSubmit={(e) => handleLoginSubmit(e, 'user')}>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Sign in to Dashboard</button>
          </form>
        </div>

        {/* =========================================
            FORM 2: ADMIN LOGIN (RIGHT SIDE)
            ========================================= */}
        <div className="auth-form-container admin-container">
          <div className="auth-header">
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <span>ADMIN PORTAL</span>
          </div>

          <h1>Welcome back</h1>
          <p className="auth-subtitle">Enter your administrator credentials.</p>

          {error && isAdminView && <div className="auth-error">{error}</div>}

          <form onSubmit={(e) => handleLoginSubmit(e, 'admin')}>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Sign in to Admin</button>
          </form>
        </div>

        {/* =========================================
            THE SLIDING OVERLAY (PURPLE PANEL)
            ========================================= */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            
            {/* LEFT OVERLAY PANEL (Visible when Admin form is active) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <div className="overlay-brand">
                <img src="/logo.png" alt="Company Logo" className="overlay-logo" />
                <div className="overlay-titles">
                </div>
              </div>
              <h3>Standard<br/>User Access</h3>
              <p>Just here to view the data and present the analytics? Switch to the client portal.</p>
              <button className="auth-ghost-btn" onClick={toggleView}>User Login</button>
            </div>

            {/* RIGHT OVERLAY PANEL (Visible when User form is active - DEFAULT) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <div className="overlay-brand">
                <img src="/logo.png" alt="Company Logo" className="overlay-logo" />
                <div className="overlay-titles">
                </div>
              </div>
              <h3>Administrator<br/> Access</h3>
              <p>Need to upload data, manage portfolios, or review system logs?</p>
              <button className="auth-ghost-btn" onClick={toggleView}>Switch to Admin</button>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}