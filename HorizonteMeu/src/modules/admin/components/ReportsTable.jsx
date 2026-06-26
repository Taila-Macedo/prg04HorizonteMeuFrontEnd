import React from 'react';
import { Check, X, Image, MessageCircle, User } from 'lucide-react';
import '../styles/ReportsTable.css';

function ReportsTable({ reports = [], onResolve, onReject }) {
  const defaultReports = [
    {
      id: 1,
      type: 'photo',
      reason: 'Conteúdo ofensivo',
      status: 'pending',
      typeLabel: 'Foto',
      icon: Image,
    },
    {
      id: 2,
      type: 'comment',
      reason: 'Spam',
      status: 'pending',
      typeLabel: 'Comentário',
      icon: MessageCircle,
    },
    {
      id: 3,
      type: 'profile',
      reason: 'Informação incorreta',
      status: 'pending',
      typeLabel: 'Perfil',
      icon: User,
    },
    {
      id: 4,
      type: 'comment',
      reason: 'Conteúdo ofensivo',
      status: 'pending',
      typeLabel: 'Comentário',
      icon: MessageCircle,
    },
  ];

  const displayReports = reports.length > 0 ? reports : defaultReports;

  const typeColors = {
    photo: { bg: '#E6F1FB', color: '#0C447C' },
    comment: { bg: '#EEEDFE', color: '#3C3489' },
    profile: { bg: '#FAECE7', color: '#712B13' },
  };

  return (
    <div className="reports-table-wrapper">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {displayReports.map((report) => {
            const colors = typeColors[report.type] || typeColors.photo;
            const IconComponent = report.icon || Image;
            return (
              <tr key={report.id}>
                <td>
                  <span className="type-pill" style={{ background: colors.bg, color: colors.color }}>
                    <IconComponent size={12} />
                    <span>{report.typeLabel}</span>
                  </span>
                </td>
                <td className="reason-cell">{report.reason}</td>
                <td>
                  <span className="status-pill pending">Pendente</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action resolve"
                      onClick={() => onResolve?.(report.id)}
                      title="Resolver"
                    >
                      <Check size={14} />
                      <span>Resolver</span>
                    </button>
                    <button
                      className="btn-action reject"
                      onClick={() => onReject?.(report.id)}
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

export default ReportsTable;
