import React from 'react';
import { Check, X, Trash2, Image, MessageCircle, User } from 'lucide-react';
import '../styles/ReportsTable.css';

const typeConfig = {
  photo:   { label: 'Foto',        icon: Image,          bg: '#E6F1FB', color: '#0C447C' },
  comment: { label: 'Comentário',  icon: MessageCircle,  bg: '#EEEDFE', color: '#3C3489' },
  profile: { label: 'Perfil',      icon: User,           bg: '#FAECE7', color: '#712B13' },
};

const acaoLabel = {
  resolver: 'Resolver?',
  rejeitar: 'Rejeitar?',
  excluir:  'Excluir conteúdo?',
};

function ReportsTable({
  reports = [],
  confirmandoId,
  confirmandoAcao,
  onPedirConfirmacao,
  onConfirmar,
  onCancelar,
}) {
  if (reports.length === 0) {
    return (
      <div className="reports-table-wrapper" style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Nenhuma denúncia pendente.
      </div>
    );
  }

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
          {reports.map((report) => {
            const cfg = typeConfig[report.type] || typeConfig.photo;
            const IconComponent = cfg.icon;
            const esteConfirmando = confirmandoId === report.id;
            // A exclusão de conteúdo só faz sentido para denúncias de foto/comentário —
            // denúncias de perfil de usuário não excluem conteúdo automaticamente.
            const permiteExcluirConteudo = report.type === 'photo' || report.type === 'comment';

            return (
              <tr key={report.id}>
                <td>
                  <span className="type-pill" style={{ background: cfg.bg, color: cfg.color }}>
                    <IconComponent size={12} />
                    <span>{report.typeLabel ?? cfg.label}</span>
                  </span>
                </td>
                <td className="reason-cell">{report.reason}</td>
                <td>
                  <span className="status-pill pending">Pendente</span>
                </td>
                <td>
                  {/* Confirmação inline — substitui alert() */}
                  {esteConfirmando ? (
                    <div className="action-confirm-inline">
                      <span className="confirm-pergunta">
                        {acaoLabel[confirmandoAcao] ?? 'Confirmar?'}
                      </span>
                      <button
                        className="btn-action resolve"
                        onClick={() => onConfirmar(report.id)}
                      >
                        <Check size={14} /> Sim
                      </button>
                      <button
                        className="btn-action reject"
                        onClick={onCancelar}
                      >
                        <X size={14} /> Não
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="btn-action resolve"
                        onClick={() => onPedirConfirmacao(report.id, 'resolver')}
                        title="Resolver sem excluir o conteúdo"
                      >
                        <Check size={14} /><span>Resolver</span>
                      </button>
                      {permiteExcluirConteudo && (
                        <button
                          className="btn-action delete"
                          onClick={() => onPedirConfirmacao(report.id, 'excluir')}
                          title="Resolver e excluir o conteúdo denunciado"
                        >
                          <Trash2 size={14} /><span>Excluir</span>
                        </button>
                      )}
                      <button
                        className="btn-action reject"
                        onClick={() => onPedirConfirmacao(report.id, 'rejeitar')}
                        title="Rejeitar denúncia"
                      >
                        <X size={14} /><span>Rejeitar</span>
                      </button>
                    </div>
                  )}
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