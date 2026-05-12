import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header className="top-header">
      {/* UPDATED HEADER LEFT */}
      <div className="header-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Sumathi Universal
        </h1>
        <h2 style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
          Marketing Dashboard
        </h2>
      </div>
      
      <div className="header-right">
        <div className="datetime-display">
          <div>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div style={{ fontWeight: '600' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="admin-profile">
          <div className="avatar">A</div>
          <span>Hello Admin</span>
        </div>

        <button className="icon-btn" style={{ color: '#EF4444' }} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}