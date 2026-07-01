import React from 'react';
import { LogOut } from 'lucide-react';
import '../styles/AdminTopbar.css';

function AdminTopbar({ onLogout }) {
  return (
    <div className="admin-topbar">
      <div className="topbar-logo">
        <span className="topbar-icon">🧭</span>
        <span className="topbar-title">Horizonte Meu</span>
        <span className="topbar-badge">Admin</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn logout-btn" onClick={onLogout} title="Sair">
          <LogOut size={18} />
          <span className="logout-label">Sair</span>
        </button>
      </div>
    </div>
  );
}

export default AdminTopbar;