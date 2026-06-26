import React from 'react';
import { TrendingUp, TrendingDown, Globe, Clock, AlertCircle } from 'lucide-react';
import '../styles/MetricsCard.css';

function MetricsCard({ value, label, subtext, trend, trendType = 'up', icon: Icon = null }) {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {subtext && (
        <div className={`metric-sub ${trendType}`}>
          {trendType === 'up' && <TrendingUp size={12} />}
          {trendType === 'down' && <TrendingDown size={12} />}
          {trendType === 'neutral' && <Globe size={12} />}
          {trendType === 'warning' && <Clock size={12} />}
          {trendType === 'alert' && <AlertCircle size={12} />}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}

export default MetricsCard;