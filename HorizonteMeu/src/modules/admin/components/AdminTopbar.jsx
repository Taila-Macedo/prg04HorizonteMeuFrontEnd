import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import '../styles/AdminTopbar.css';

function AdminTopbar({ userName = 'Admin', onLogout }) {
  return (
    <div className="admin-topbar">
      <div className="topbar-logo">
        <span className="topbar-icon">🧭</span>
        <span className="topbar-title">Horizonte Meu</span>
        <span className="topbar-badge">Admin</span>
      </div>

      <div className="topbar-actions">
        <button className="topbar-btn" title="Notificações">
          <Bell size={20} />
        </button>
        
        <div className="topbar-avatar">
          {userName.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>

        <button className="topbar-btn logout-btn" onClick={onLogout} title="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

export default AdminTopbar;
