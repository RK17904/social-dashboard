import React, { useState, useEffect } from 'react';
import { LogOut, Moon, Sun } from 'lucide-react';

export default function Header({ role, onLogout }) {
  // --- REAL-TIME CLOCK LOGIC ---
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the clock every single second
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format the date exactly like your screenshot (e.g., "Wednesday, May 13, 2026")
  const dateString = time.toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
  });
  
  // Format the time exactly like your screenshot (e.g., "01:00 PM")
  const timeString = time.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit' 
  });

  // --- HEADER THEME TOGGLE (Optional bonus to make that moon icon work!) ---
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 30px', 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      
      {/* LEFT SECTION: Brand Titles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h1 style={{ 
          color: 'var(--accent-primary)', 
          fontSize: '1.4rem', 
          fontWeight: '800', 
          margin: 0, 
          textTransform: 'uppercase', 
          letterSpacing: '0.5px' 
        }}>
          Sumathi Universal
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          margin: 0, 
          fontSize: '0.95rem', 
          fontWeight: '500' 
        }}>
          Marketing Dashboard
        </p>
      </div>

      {/* RIGHT SECTION: Controls & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        
        {/* 1. Live Date & Time */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
            {dateString}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '700', marginTop: '2px' }}>
            {timeString}
          </div>
        </div>

        {/* 2. Theme Toggle Icon */}
        <button 
          onClick={toggleTheme} 
          title="Toggle Theme"
          style={{ 
            background: 'transparent', border: 'none', cursor: 'pointer', 
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '5px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 3. User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '38px', height: '38px', borderRadius: '50%', 
            backgroundColor: 'var(--accent-primary)', color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(112, 82, 255, 0.3)'
          }}>
            {/* Show "A" for Admin, "U" for User */}
            {role === 'admin' ? 'A' : 'U'}
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem' }}>
            Hello {role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>

        {/* 4. Logout Icon */}
        <button 
          onClick={onLogout} 
          title="Logout" 
          style={{ 
            background: 'transparent', border: 'none', cursor: 'pointer', 
            color: '#EF4444', display: 'flex', alignItems: 'center', padding: '5px',
            marginLeft: '5px', transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <LogOut size={24} />
        </button>

      </div>
    </header>
  );
}