import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/SectionCard.css';

function SectionCard({ title, icon: Icon, children, onViewAll, actionLabel = 'Ver todas' }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title">
          {Icon && <Icon size={18} />}
          <span>{title}</span>
        </div>
        {onViewAll && (
          <button className="section-action" onClick={onViewAll}>
            <ArrowRight size={14} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

export default SectionCard;
