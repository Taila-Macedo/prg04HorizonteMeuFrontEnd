import React, { useState, useEffect, useCallback } from 'react';
import { Image, AlertTriangle, MapPin, Check, X } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import AdminTopbar from '../components/AdminTopbar';
import AdminSidebar from '../components/AdminSidebar';
import MetricsCard from '../components/MetricsCard';
import SectionCard from '../components/SectionCard';
import PhotoApprovalTable from '../components/PhotoApprovalTable';
import ReportsTable from '../components/ReportsTable';
import PainelAdm from '../components/PainelAdm';
import '../styles/AdminDashboard.css';

// ── Toast de feedback ────────────────────────────────────────────────────────
// Aparece no canto superior direito e some após 3 segundos.
function AdminToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`admin-toast admin-toast--${toast.tipo}`}>
      {toast.tipo === 'sucesso' ? <Check size={16} /> : <X size={16} />}
      <span>{toast.mensagem}</span>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { users, photos, metrics, loading, error, deleteUser, approvePhoto, rejectPhoto } = useAdminData();

  // Toast: { mensagem, tipo: 'sucesso' | 'erro' }
  const [toast, setToast] = useState(null);

  // IDs em estado de confirmação inline (para fotos e denúncias)
  const [confirmandoFotoId, setConfirmandoFotoId]     = useState(null); // 'aprovar' ou 'rejeitar'
  const [confirmandoFotoAcao, setConfirmandoFotoAcao] = useState(null);
  const [confirmandoReportId, setConfirmandoReportId]       = useState(null);
  const [confirmandoReportAcao, setConfirmandoReportAcao]   = useState(null);

  // Mock de denúncias — TODO: GET /denuncias quando endpoint estiver disponível
  const [reports] = useState([
    { id: 1, type: 'photo',   reason: 'Conteúdo ofensivo',   status: 'pending', typeLabel: 'Foto' },
    { id: 2, type: 'comment', reason: 'Spam',                status: 'pending', typeLabel: 'Comentário' },
    { id: 3, type: 'profile', reason: 'Informação incorreta', status: 'pending', typeLabel: 'Perfil' },
    { id: 4, type: 'comment', reason: 'Conteúdo ofensivo',   status: 'pending', typeLabel: 'Comentário' },
  ]);

  const mostrarToast = useCallback((mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo });
  }, []);

  const fecharToast = useCallback(() => setToast(null), []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // ── Ações de foto ────────────────────────────────────────────────────────
  // Primeiro clique → abre confirmação inline; segundo clique → executa
  const pedirConfirmacaoFoto = (id, acao) => {
    setConfirmandoFotoId(id);
    setConfirmandoFotoAcao(acao);
  };

  const cancelarConfirmacaoFoto = () => {
    setConfirmandoFotoId(null);
    setConfirmandoFotoAcao(null);
  };

  const confirmarAcaoFoto = async (id) => {
    cancelarConfirmacaoFoto();
    if (confirmandoFotoAcao === 'aprovar') {
      const ok = await approvePhoto(id);
      mostrarToast(ok ? 'Foto aprovada com sucesso!' : 'Erro ao aprovar foto.', ok ? 'sucesso' : 'erro');
    } else {
      const ok = await rejectPhoto(id);
      mostrarToast(ok ? 'Foto rejeitada.' : 'Erro ao rejeitar foto.', ok ? 'sucesso' : 'erro');
    }
  };

  // ── Ações de denúncia ────────────────────────────────────────────────────
  const pedirConfirmacaoReport = (id, acao) => {
    setConfirmandoReportId(id);
    setConfirmandoReportAcao(acao);
  };

  const cancelarConfirmacaoReport = () => {
    setConfirmandoReportId(null);
    setConfirmandoReportAcao(null);
  };

  const confirmarAcaoReport = (id) => {
    cancelarConfirmacaoReport();
    // TODO: PATCH /denuncias/{id}/resolver ou /rejeitar
    const msg = confirmandoReportAcao === 'resolver'
      ? 'Denúncia marcada como resolvida.'
      : 'Denúncia rejeitada.';
    mostrarToast(msg, 'sucesso');
  };

  // ── Ações de usuário ─────────────────────────────────────────────────────
  // PainelAdm já tem modal de confirmação interno — só precisamos do toast de resultado
  const handleUserDelete = async (user) => {
    const ok = await deleteUser(user.id);
    mostrarToast(
      ok ? `Usuário "${user.nome}" excluído.` : 'Erro ao excluir usuário.',
      ok ? 'sucesso' : 'erro'
    );
  };

  const handleUserEdit = (user) => {
    // TODO: abrir modal de edição de usuário
    mostrarToast(`Edição de "${user.nome}" ainda não implementada.`, 'erro');
  };

  // ── Loading / Erro ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="admin-shell">
        <AdminTopbar userName="Admin" onLogout={handleLogout} />
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          pendingPhotos={0}
          pendingReports={0}
        />
        <div className="admin-main">
          <div className="loading-message">Carregando dados...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-shell">
        <AdminTopbar userName="Admin" onLogout={handleLogout} />
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          pendingPhotos={0}
          pendingReports={0}
        />
        <div className="admin-main">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  // ── Renderiza a seção ativa ──────────────────────────────────────────────
  const renderContent = () => {
    switch (activeSection) {

      case 'dashboard':
        return (
          <div className="admin-content">
            <div className="metrics-grid">
              <MetricsCard
                value={metrics?.usersCount ?? '—'}
                label="Usuários cadastrados"
                subtext="+12 esta semana"
                trendType="up"
              />
              <MetricsCard
                value={metrics?.pointsCount ?? '—'}
                label="Pontos turísticos"
                subtext="42 países"
                trendType="neutral"
              />
              <MetricsCard
                value={metrics?.pendingPhotosCount ?? photos.length}
                label="Fotos aguardando aprovação"
                subtext="Mais antiga: 3 dias"
                trendType="warning"
              />
              <MetricsCard
                value={metrics?.pendingReportsCount ?? reports.length}
                label="Denúncias pendentes"
                subtext="1 denúncia de perfil"
                trendType="alert"
              />
            </div>

            <div className="content-grid">
              <SectionCard
                title="Fotos aguardando aprovação"
                icon={Image}
                onViewAll={() => setActiveSection('photos')}
              >
                <PhotoApprovalTable
                  photos={photos}
                  confirmandoId={confirmandoFotoId}
                  confirmandoAcao={confirmandoFotoAcao}
                  onPedirConfirmacao={pedirConfirmacaoFoto}
                  onConfirmar={confirmarAcaoFoto}
                  onCancelar={cancelarConfirmacaoFoto}
                />
              </SectionCard>

              <SectionCard
                title="Denúncias pendentes"
                icon={AlertTriangle}
                onViewAll={() => setActiveSection('reports')}
              >
                <ReportsTable
                  reports={reports}
                  confirmandoId={confirmandoReportId}
                  confirmandoAcao={confirmandoReportAcao}
                  onPedirConfirmacao={pedirConfirmacaoReport}
                  onConfirmar={confirmarAcaoReport}
                  onCancelar={cancelarConfirmacaoReport}
                />
              </SectionCard>
            </div>

            <SectionCard
              title="Pontos turísticos cadastrados recentemente"
              icon={MapPin}
              actionLabel="Gerenciar"
              onViewAll={() => setActiveSection('points')}
            >
              <div className="placeholder-content">
                <p>Clique em "Gerenciar" para ver e cadastrar pontos turísticos.</p>
              </div>
            </SectionCard>
          </div>
        );

      case 'photos':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Fotos Pendentes de Aprovação</h2>
              <p>Gerencie todas as fotos enviadas pelos usuários</p>
            </div>
            <SectionCard title="Todas as fotos pendentes" icon={Image}>
              <PhotoApprovalTable
                photos={photos}
                confirmandoId={confirmandoFotoId}
                confirmandoAcao={confirmandoFotoAcao}
                onPedirConfirmacao={pedirConfirmacaoFoto}
                onConfirmar={confirmarAcaoFoto}
                onCancelar={cancelarConfirmacaoFoto}
              />
            </SectionCard>
          </div>
        );

      case 'reports':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Denúncias Pendentes</h2>
              <p>Revise e resolva as denúncias dos usuários</p>
            </div>
            <SectionCard title="Todas as denúncias" icon={AlertTriangle}>
              <ReportsTable
                reports={reports}
                confirmandoId={confirmandoReportId}
                confirmandoAcao={confirmandoReportAcao}
                onPedirConfirmacao={pedirConfirmacaoReport}
                onConfirmar={confirmarAcaoReport}
                onCancelar={cancelarConfirmacaoReport}
              />
            </SectionCard>
          </div>
        );

      case 'users':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Gerenciar Usuários</h2>
              <p>Lista de todos os usuários cadastrados no sistema</p>
            </div>
            <div className="section-card-wrapper">
              <PainelAdm
                users={users}
                onEdit={handleUserEdit}
                onDelete={handleUserDelete}
              />
            </div>
          </div>
        );

      case 'points':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Pontos Turísticos</h2>
              <p>Gerencie os pontos turísticos cadastrados</p>
            </div>
            <div className="placeholder-content">
              <p>Tabela de pontos turísticos em desenvolvimento...</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Configurações do Sistema</h2>
              <p>Ajuste as configurações gerais da plataforma</p>
            </div>
            <div className="placeholder-content">
              <p>Funcionalidade de configurações em desenvolvimento...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-shell">
      <AdminToast toast={toast} onClose={fecharToast} />

      <AdminTopbar userName="Admin User" onLogout={handleLogout} />

      {/* Sidebar recebe contadores reais para exibir nos badges */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        pendingPhotos={metrics?.pendingPhotosCount ?? photos.length}
        pendingReports={metrics?.pendingReportsCount ?? reports.length}
      />

      <div className="admin-main">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;