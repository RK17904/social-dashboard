import React, { useState } from 'react';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import Login from './pages/Login'; // Import the new Login page

export default function App() {
  // New state to track if someone has successfully logged in
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('auth') === 'true');
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);  

  const handleLogin = (assignedRole) => {
    setRole(assignedRole);
    setIsAuthenticated(true);
    // Save to browser memory
    localStorage.setItem('auth', 'true');
    localStorage.setItem('role', assignedRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    // Erase from browser memory
    localStorage.removeItem('auth');
    localStorage.removeItem('role');
  };

  // 1. THE AUTHENTICATION WALL
  // If they are not logged in, they ONLY see the Login screen.
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. THE ROUTER
  // Once logged in, route them to the correct dashboard
  return (
    <>
      {role === 'admin' ? <AdminApp onLogout={handleLogout} /> : <UserApp onLogout={handleLogout} />}
    </>
  );
}