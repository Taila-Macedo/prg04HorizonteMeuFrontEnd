import React from 'react';
import { Check, X, Waves, Building2, Mountain, Trees } from 'lucide-react';
import '../styles/PhotoApprovalTable.css';

function PhotoApprovalTable({ photos = [], onApprove, onReject }) {
  const iconMap = {
    waves: { icon: Waves, color: '#185FA5', bg: '#E6F1FB' },
    building: { icon: Building2, color: '#534AB7', bg: '#EEEDFE' },
    mountain: { icon: Mountain, color: '#3B6D11', bg: '#EAF3DE' },
    trees: { icon: Trees, color: '#0F6E56', bg: '#E1F5EE' },
  };

  const defaultPhotos = [
    {
      id: 1,
      name: 'Pôr do sol na praia',
      location: 'Jericoacoara',
      user: '@maria_s',
      date: 'há 3 dias',
      iconType: 'waves',
    },
    {
      id: 2,
      name: 'Fachada principal',
      location: 'Louvre',
      user: '@joao_v',
      date: 'há 2 dias',
      iconType: 'building',
    },
    {
      id: 3,
      name: 'Vista do topo',
      location: 'Machu Picchu',
      user: '@carla_m',
      date: 'há 1 dia',
      iconType: 'mountain',
    },
    {
      id: 4,
      name: 'Cachoeira da trilha',
      location: 'Chapada',
      user: '@pedro_r',
      date: 'há 8 h',
      iconType: 'trees',
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  return (
    <div className="photo-table-wrapper">
      <table className="photo-table">
        <thead>
          <tr>
            <th>Foto / ponto</th>
            <th>Enviada</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {displayPhotos.map((photo) => {
            const iconData = iconMap[photo.iconType] || iconMap.waves;
            const IconComponent = iconData.icon;
            return (
              <tr key={photo.id}>
                <td>
                  <div className="photo-row">
                    <div className="photo-thumb" style={{ background: iconData.bg }}>
                      <IconComponent size={20} color={iconData.color} />
                    </div>
                    <div className="photo-info">
                      <div className="photo-name">{photo.name}</div>
                      <div className="photo-meta">
                        {photo.location} · {photo.user}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="photo-date">{photo.date}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action approve"
                      onClick={() => onApprove?.(photo.id)}
                      title="Aprovar"
                    >
                      <Check size={14} />
                      <span>Aprovar</span>
                    </button>
                    <button
                      className="btn-action reject"
                      onClick={() => onReject?.(photo.id)}
                      title="Rejeitar"
                    >
                      <X size={14} />
                      <span>Rejeitar</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PhotoApprovalTable;
