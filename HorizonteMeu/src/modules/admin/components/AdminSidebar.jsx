import React from 'react';
import {
  LayoutDashboard,
  Image,
  AlertTriangle,
  MapPin,
  Users,
  Trophy,
  Settings,
} from 'lucide-react';
import '../styles/AdminSidebar.css';

function AdminSidebar({ activeSection, onSectionChange }) {
    const sections = [
       {
      id: 'overview',
      label: 'Visão geral',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      ],
    },
    {
      id: 'moderation',
      label: 'Moderação',
      items: [
        { id: 'photos', icon: Image, label: 'Fotos pendentes', badge: '7' },
        { id: 'reports', icon: AlertTriangle, label: 'Denúncias', badge: '4' },
      ],
    },
    {
      id: 'content',
      label: 'Conteúdo',
      items: [
        { id: 'points', icon: MapPin, label: 'Pontos turísticos', badge: null },
        { id: 'users', icon: Users, label: 'Usuários', badge: null },
      ],
    },
    {
      id: 'system',
      label: 'Sistema',
      items: [
        { id: 'badges', icon: Trophy, label: 'Badges', badge: null },
        { id: 'settings', icon: Settings, label: 'Configurações', badge: null },
      ],
    },
  ];


  return (
    <div className="admin-sidebar">
        {sections.map((section) => (
         <div key={section.id} className="nav-section">
          <div className="nav-section-label">{section.label}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && <span className={`nav-count ${item.id === 'photos' ? 'amber' : ''}`}>{item.badge}</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

}

export default AdminSidebar;