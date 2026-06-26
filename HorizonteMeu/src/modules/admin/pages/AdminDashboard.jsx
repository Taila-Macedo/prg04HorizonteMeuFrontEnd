import React, { useState } from 'react';
import { Image, AlertTriangle, MapPin } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import AdminTopbar from '../components/AdminTopbar';
import AdminSidebar from '../components/AdminSidebar';
import MetricsCard from '../components/MetricsCard';
import SectionCard from '../components/SectionCard';
import PhotoApprovalTable from '../components/PhotoApprovalTable';
import ReportsTable from '../components/ReportsTable';
import PainelAdm from '../components/PainelAdm';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { users, photos, metrics, loading, error, deleteUser, approvePhoto, rejectPhoto } = useAdminData();
  const [reports, setReports] = useState([]);

  const handlePhotoApprove = async (photoId) => {
    const success = await approvePhoto(photoId);
    if (success) alert('Foto aprovada com sucesso!');
  };

  const handlePhotoReject = async (photoId) => {
    const success = await rejectPhoto(photoId);
    if (success) alert('Foto rejeitada com sucesso!');
  };

  const handleReportResolve = (reportId) => {
    alert(`Denúncia ${reportId} resolvida!`);
    // Integrar com API real
  };

  const handleReportReject = (reportId) => {
    alert(`Denúncia ${reportId} rejeitada!`);
    // Integrar com API real
  };

  const handleUserEdit = (user) => {
    alert(`Editar usuário: ${user.nome}`);
    // TODO: Implementar modal de edição
  };

  const handleUserDelete = async (user) => {
    if (window.confirm(`Tem certeza que deseja excluir ${user.nome}?`)) {
      const success = await deleteUser(user.id);
      if (success) alert('Usuário excluído com sucesso!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="admin-shell">
        <AdminTopbar userName="Admin" onLogout={handleLogout} />
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
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
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="admin-main">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="admin-content">
            {/* Métricas */}
            <div className="metrics-grid">
              <MetricsCard
                value={metrics?.usersCount || '1.284'}
                label="Usuários cadastrados"
                subtext="+12 esta semana"
                trendType="up"
              />
              <MetricsCard
                value={metrics?.pointsCount || '348'}
                label="Pontos turísticos"
                subtext="42 países"
                trendType="neutral"
              />
              <MetricsCard
                value={metrics?.pendingPhotosCount || '7'}
                label="Fotos aguardando aprovação"
                subtext="Mais antiga: 3 dias"
                trendType="warning"
              />
              <MetricsCard
                value={metrics?.pendingReportsCount || '4'}
                label="Denúncias pendentes"
                subtext="1 denúncia de perfil"
                trendType="alert"
              />
            </div>

            {/* Seções de conteúdo em duas colunas */}
            <div className="content-grid">
              <SectionCard
                title="Fotos aguardando aprovação"
                icon={Image}
                onViewAll={() => setActiveSection('photos')}
              >
                <PhotoApprovalTable
                  photos={photos}
                  onApprove={handlePhotoApprove}
                  onReject={handlePhotoReject}
                />
              </SectionCard>

              <SectionCard
                title="Denúncias pendentes"
                icon={AlertTriangle}
                onViewAll={() => setActiveSection('reports')}
              >
                <ReportsTable
                  reports={reports}
                  onResolve={handleReportResolve}
                  onReject={handleReportReject}
                />
              </SectionCard>
            </div>

            {/* Seção de pontos turísticos */}
            <SectionCard
              title="Pontos turísticos cadastrados recentemente"
              icon={MapPin}
              actionLabel="Cadastrar novo"
            >
              <div className="placeholder-content">
                <p>Funcionalidade de pontos turísticos em desenvolvimento...</p>
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
                onApprove={handlePhotoApprove}
                onReject={handlePhotoReject}
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
                onResolve={handleReportResolve}
                onReject={handleReportReject}
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
              <p>Funcionalidade de pontos turísticos em desenvolvimento...</p>
            </div>
          </div>
        );

      case 'badges':
        return (
          <div className="admin-content">
            <div className="section-header">
              <h2>Badges do Sistema</h2>
              <p>Gerencie as badges e conquistas dos usuários</p>
            </div>
            <div className="placeholder-content">
              <p>Funcionalidade de badges em desenvolvimento...</p>
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
      <AdminTopbar userName="Admin User" onLogout={handleLogout} />
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="admin-main">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
