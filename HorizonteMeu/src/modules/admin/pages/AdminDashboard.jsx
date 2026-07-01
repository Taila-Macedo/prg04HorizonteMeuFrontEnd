import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, AlertTriangle, MapPin, Check, X, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import { adminService } from '../hooks/useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';
import AdminTopbar from '../components/AdminTopbar';
import AdminSidebar from '../components/AdminSidebar';
import MetricsCard from '../components/MetricsCard';
import SectionCard from '../components/SectionCard';
import PhotoApprovalTable from '../components/PhotoApprovalTable';
import ReportsTable from '../components/ReportsTable';
import PainelAdm from '../components/PainelAdm';
import '../styles/AdminDashboard.css';

// ── Toast de feedback ──────────────────────────────────────────────────────
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

// ── Componente principal ───────────────────────────────────────────────────
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const {
    users, photos, points, metrics,
    loading, error,
    refresh,
    deleteUser, updateUser,
    approvePhoto, rejectPhoto,
  } = useAdminData();
  const { usuario, token, logout } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const mostrarToast = useCallback((mensagem, tipo = 'sucesso') => setToast({ mensagem, tipo }), []);
  const fecharToast  = useCallback(() => setToast(null), []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Fotos ─────────────────────────────────────────────────────────────
  const [confirmandoFotoId,  setConfirmandoFotoId]  = useState(null);
  const [confirmandoFotoAcao, setConfirmandoFotoAcao] = useState(null);

  const pedirConfirmacaoFoto  = (id, acao) => { setConfirmandoFotoId(id); setConfirmandoFotoAcao(acao); };
  const cancelarConfirmacaoFoto = () => { setConfirmandoFotoId(null); setConfirmandoFotoAcao(null); };
  const confirmarAcaoFoto = async (id) => {
    cancelarConfirmacaoFoto();
    const ok = confirmandoFotoAcao === 'aprovar' ? await approvePhoto(id) : await rejectPhoto(id);
    mostrarToast(
      confirmandoFotoAcao === 'aprovar'
        ? (ok ? 'Foto aprovada!' : 'Erro ao aprovar foto.')
        : (ok ? 'Foto rejeitada.' : 'Erro ao rejeitar foto.'),
      ok ? 'sucesso' : 'erro'
    );
  };

  // ── Denúncias (mock — sprint futura) ───────────────────────────────────
  const [reports] = useState([]);
  const [confirmandoReportId,   setConfirmandoReportId]   = useState(null);
  const [confirmandoReportAcao, setConfirmandoReportAcao] = useState(null);
  const pedirConfirmacaoReport  = (id, acao) => { setConfirmandoReportId(id); setConfirmandoReportAcao(acao); };
  const cancelarConfirmacaoReport = () => { setConfirmandoReportId(null); setConfirmandoReportAcao(null); };
  const confirmarAcaoReport = (id) => {
    cancelarConfirmacaoReport();
    mostrarToast(confirmandoReportAcao === 'resolver' ? 'Denúncia resolvida.' : 'Denúncia rejeitada.');
  };

  // ── Pontos turísticos ──────────────────────────────────────────────────
  const [confirmandoPontoId, setConfirmandoPontoId] = useState(null);
  const pedirConfirmacaoPonto  = (id) => setConfirmandoPontoId(id);
  const cancelarConfirmacaoPonto = () => setConfirmandoPontoId(null);

  const confirmarExcluirPonto = async (id) => {
    cancelarConfirmacaoPonto();
    const ok = await adminService.deletePoint(id, token).then(() => true).catch(() => false);
    mostrarToast(ok ? 'Ponto excluído.' : 'Erro ao excluir ponto.', ok ? 'sucesso' : 'erro');
    if (ok) refresh();
  };

  // ── Usuários ───────────────────────────────────────────────────────────
  const handleUserDelete = async (user) => {
    const ok = await deleteUser(user.id);
    mostrarToast(
      ok ? `Usuário "${user.nome}" excluído.` : 'Erro ao excluir usuário.',
      ok ? 'sucesso' : 'erro'
    );
  };

  const handleUserSave = async (user, dadosEditados) => {
    const ok = await updateUser(user.id, dadosEditados);
    mostrarToast(
      ok ? `Usuário "${dadosEditados.nome}" atualizado.` : 'Erro ao atualizar usuário.',
      ok ? 'sucesso' : 'erro'
    );
    return ok;
  };

  // ── Loading / Erro ─────────────────────────────────────────────────────
  const shell = (conteudo) => (
    <div className="admin-shell">
      <AdminTopbar onLogout={handleLogout} />
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} pendingPhotos={0} pendingReports={0} />
      <div className="admin-main">{conteudo}</div>
    </div>
  );

  if (loading) return shell(<div className="loading-message">Carregando dados...</div>);
  if (error)   return shell(<div className="error-message">{error}</div>);

  // ── Conteúdo por seção ─────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeSection) {

      // ── Dashboard ──────────────────────────────────────────────────────
      case 'dashboard':
        return (
          <div className="admin-content">
            <div className="metrics-grid">
              <MetricsCard value={metrics?.usersCount ?? '—'} label="Usuários cadastrados" subtext="total" trendType="up" />
              <MetricsCard value={metrics?.pointsCount ?? '—'} label="Pontos turísticos" subtext="total" trendType="neutral" />
              <MetricsCard value={metrics?.pendingPhotosCount ?? photos.length} label="Fotos aguardando aprovação" subtext="pendentes" trendType="warning" />
              <MetricsCard value={reports.length} label="Denúncias pendentes" subtext="sprint futura" trendType="alert" />
            </div>

            <div className="content-grid">
              <SectionCard title="Fotos aguardando aprovação" icon={Image} onViewAll={() => setActiveSection('photos')}>
                <PhotoApprovalTable
                  photos={photos.slice(0, 4)}
                  confirmandoId={confirmandoFotoId}
                  confirmandoAcao={confirmandoFotoAcao}
                  onPedirConfirmacao={pedirConfirmacaoFoto}
                  onConfirmar={confirmarAcaoFoto}
                  onCancelar={cancelarConfirmacaoFoto}
                />
              </SectionCard>

              <SectionCard title="Denúncias pendentes" icon={AlertTriangle} onViewAll={() => setActiveSection('reports')}>
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

            <SectionCard title="Pontos turísticos cadastrados recentemente" icon={MapPin} actionLabel="Gerenciar" onViewAll={() => setActiveSection('points')}>
              {points.length === 0 ? (
                <div className="placeholder-content"><p>Nenhum ponto cadastrado ainda.</p></div>
              ) : (
                <ul className="points-quick-list">
                  {points.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      <span className="points-quick-name">{p.nome}</span>
                      <span className="points-quick-meta">{p.cidade}, {p.pais}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        );

      // ── Fotos ──────────────────────────────────────────────────────────
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

      // ── Denúncias ──────────────────────────────────────────────────────
      case 'reports':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Denúncias Pendentes</h2>
              <p>Módulo previsto para a próxima sprint</p>
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

      // ── Pontos Turísticos ──────────────────────────────────────────────
      case 'points':
        return (
          <div className="admin-content">
            <div className="section-header-row">
              <div className="section-header">
                <h2>Pontos Turísticos</h2>
                <p>{points.length} ponto{points.length !== 1 ? 's' : ''} cadastrado{points.length !== 1 ? 's' : ''}</p>
              </div>
              <button className="btn-novo-ponto" onClick={() => navigate('/pontos/novo')}>
                <PlusCircle size={16} />
                Novo Ponto
              </button>
            </div>

            {points.length === 0 ? (
              <div className="placeholder-content">
                <p>Nenhum ponto turístico cadastrado ainda.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table id="tabela-pontos">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Cidade / País</th>
                      <th>Categoria</th>
                      <th>Nota</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((p) => {
                      const esteConfirmando = confirmandoPontoId === p.id;
                      return (
                        <tr key={p.id}>
                          <td><span className="id-badge">#{String(p.id).padStart(3, '0')}</span></td>
                          <td className="ponto-nome-cell">{p.nome}</td>
                          <td>{p.cidade}, {p.pais}</td>
                          <td>
                            <span className="categoria-badge">{p.categoria}</span>
                          </td>
                          <td>{(p.notaMedia ?? 0).toFixed(1)} ★</td>
                          <td>
                            {esteConfirmando ? (
                              <div className="action-confirm-inline">
                                <span className="confirm-pergunta">Excluir?</span>
                                <button className="btn-action-sm confirmar" onClick={() => confirmarExcluirPonto(p.id)}>
                                  <Check size={13} /> Sim
                                </button>
                                <button className="btn-action-sm cancelar" onClick={cancelarConfirmacaoPonto}>
                                  <X size={13} /> Não
                                </button>
                              </div>
                            ) : (
                              <div className="acoes">
                                <button className="btn-editar" onClick={() => navigate(`/pontos/${p.id}/editar`)}>
                                  <Pencil size={13} /><span>Editar</span>
                                </button>
                                <button className="btn-excluir" onClick={() => pedirConfirmacaoPonto(p.id)}>
                                  <Trash2 size={13} /><span>Excluir</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="table-footer">
                  <span>{points.length} ponto{points.length !== 1 ? 's' : ''} encontrado{points.length !== 1 ? 's' : ''}</span>
                  <span>Horizonte Meu · Admin</span>
                </div>
              </div>
            )}
          </div>
        );

      // ── Usuários ───────────────────────────────────────────────────────
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
                onSave={handleUserSave}
                onDelete={handleUserDelete}
              />
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
      <AdminTopbar onLogout={handleLogout} />
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        pendingPhotos={metrics?.pendingPhotosCount ?? photos.length}
        pendingReports={0}
      />
      <div className="admin-main">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;