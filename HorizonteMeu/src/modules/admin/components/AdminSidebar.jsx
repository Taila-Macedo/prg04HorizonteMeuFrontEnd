import React from 'react';
import {
  LayoutDashboard,
  Image,
  AlertTriangle,
  MapPin,
  Users,
  Settings,
} from 'lucide-react';
import '../styles/AdminSidebar.css';

function AdminSidebar({ activeSection, onSectionChange, pendingPhotos = 0, pendingReports = 0 }) {
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
        // Badges dinâmicos: só aparecem se o número for maior que zero
        { id: 'photos',  icon: Image,          label: 'Fotos pendentes', badge: pendingPhotos  > 0 ? String(pendingPhotos)  : null, badgeColor: 'amber' },
        { id: 'reports', icon: AlertTriangle,   label: 'Denúncias',      badge: pendingReports > 0 ? String(pendingReports) : null, badgeColor: 'red'   },
      ],
    },
    {
      id: 'content',
      label: 'Conteúdo',
      items: [
        { id: 'points', icon: MapPin,  label: 'Pontos turísticos', badge: null },
        { id: 'users',  icon: Users,   label: 'Usuários',          badge: null },
      ],
    },
    {
      id: 'system',
      label: 'Sistema',
      items: [
        // Badges removida desta seção — não existe no backend
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
                {item.badge && (
                  <span className={`nav-count ${item.badgeColor === 'amber' ? 'amber' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default AdminSidebar;