import React, { useState } from 'react';
import { Users, UserPlus, Edit2, Trash2, Shield, User, X, CheckCircle, Mail, Lock, Type } from 'lucide-react';

export default function UserManagement() {
  // Mock Database for the Demo
  const [users, setUsers] = useState([
    { id: 1, name: 'System Admin', email: 'admin@company.com', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Client Viewer', email: 'user@company.com', role: 'user', password: 'user123' }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ id: null, name: '', email: '', role: 'user', password: '' });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', email: '', role: 'user', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (users.length === 1) return alert("You cannot delete the last user!");
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
      showToast("User deleted successfully.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return alert("Please fill all fields!");

    if (modalMode === 'add') {
      const newUser = { ...formData, id: Date.now() };
      setUsers([...users, newUser]);
      showToast("New user created successfully.");
    } else {
      setUsers(users.map(u => (u.id === formData.id ? formData : u)));
      showToast("User updated successfully.");
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', width: '100%' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="var(--accent-primary)" /> Team Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Add, update, or remove access for administrators and clients.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ padding: '10px 20px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* THE USERS TABLE */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(112, 82, 255, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>User Details</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Access Role</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>Password</th>
              <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold',
                    backgroundColor: user.role === 'admin' ? 'rgba(112, 82, 255, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: user.role === 'admin' ? 'var(--accent-primary)' : '#10B981'
                  }}>
                    {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {user.password}
                </td>
                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                  <button onClick={() => openEditModal(user)} title="Edit User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px', marginRight: '10px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(user.id)} title="Delete User" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '5px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* THE ADD/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animation-slideDown" style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.4rem' }}>
                {modalMode === 'add' ? 'Register New User' : 'Edit User Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <Type size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g., Jane Doe" style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@company.com" style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter secure password" style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Account Role</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: `1px solid ${formData.role === 'user' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.role === 'user' ? 'rgba(112, 82, 255, 0.05)' : 'var(--bg-main)' }}>
                    <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={() => setFormData({...formData, role: 'user'})} style={{ accentColor: 'var(--accent-primary)' }} />
                    <User size={16} color="var(--text-primary)" /> <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>User</span>
                  </label>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: `1px solid ${formData.role === 'admin' ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.role === 'admin' ? 'rgba(112, 82, 255, 0.05)' : 'var(--bg-main)' }}>
                    <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={() => setFormData({...formData, role: 'admin'})} style={{ accentColor: 'var(--accent-primary)' }} />
                    <Shield size={16} color="var(--text-primary)" /> <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Admin</span>
                  </label>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
                {modalMode === 'add' ? 'Create Account' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="toast-container">
          <span style={{ fontWeight: '600' }}><CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }}/> Success!</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{toast}</span>
          <div className="toast-progress"></div>
        </div>
      )}
    </div>
  );
}