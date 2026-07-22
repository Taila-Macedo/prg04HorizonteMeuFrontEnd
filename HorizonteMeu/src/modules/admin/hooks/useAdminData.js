import { useState, useEffect, useCallback } from 'react';
import { adminService } from './useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';

// Converte o DenunciaGetResponseDto (id, motivo, status, idFoto, idComentario,
// idUsuarioDenunciado, ...) no formato que a ReportsTable espera (type/reason).
function mapReport(dto) {
  const type = dto.idFoto ? 'photo' : dto.idComentario ? 'comment' : 'profile';
  return {
    id: dto.id,
    type,
    reason: dto.motivo,
    status: dto.status,
    idFoto: dto.idFoto,
    idComentario: dto.idComentario,
    idUsuarioDenunciado: dto.idUsuarioDenunciado,
  };
}

export function useAdminData() {
  const { token } = useAuth();

  const [users,   setUsers]   = useState([]);
  const [photos,  setPhotos]  = useState([]);
  const [points,  setPoints]  = useState([]);
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersData, photosData, pointsData, reportsData] = await Promise.all([
        adminService.getUsers(token).catch(() => []),
        adminService.getPendingPhotos(token).catch(() => []),
        adminService.getPoints(token).catch(() => []),
        adminService.getPendingReports(token).catch(() => []),
      ]);
      setUsers(usersData);
      setPhotos(photosData);
      setPoints(pointsData);
      setReports(reportsData.map(mapReport));
      setMetrics({
        usersCount:          usersData.length,
        pointsCount:         pointsData.length,
        pendingPhotosCount:  photosData.length,
        pendingReportsCount: reportsData.length,
      });
      setError(null);
    } catch (err) {
      setError('Falha ao carregar dados do servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const approvePhoto = async (id) => {
    try {
      await adminService.approvePhoto(id, token);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  const rejectPhoto = async (id) => {
    try {
      await adminService.rejectPhoto(id, token);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  // Marca a denúncia como resolvida, sem excluir o conteúdo denunciado.
  const resolveReport = async (id) => {
    try {
      await adminService.resolveReport(id, token);
      setReports(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  // Descarta a denúncia como inválida.
  const rejectReport = async (id) => {
    try {
      await adminService.rejectReport(id, token);
      setReports(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  // Resolve a denúncia E exclui o conteúdo denunciado (foto ou comentário),
  // notificando o autor. Não se aplica a denúncias de perfil (usuarioDenunciado).
  const resolveReportExcluindoConteudo = async (id) => {
    try {
      await adminService.resolveReportExcluindoConteudo(id, token);
      setReports(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  return {
    users, photos, points, reports, metrics,
    loading, error,
    refresh: loadData,
    approvePhoto, rejectPhoto,
    resolveReport, rejectReport, resolveReportExcluindoConteudo,
  };
}