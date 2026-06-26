import { useState, useEffect, useCallback } from 'react';
import { adminService } from './useAdminService';

/**
 * Hook customizado para gerenciar os dados do painel de administração
 */
export function useAdminData() {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, photosData, metricsData] = await Promise.all([
        adminService.getUsers().catch(() => []), // Fallback para array vazio se falhar
        adminService.getPendingPhotos().catch(() => []),
        adminService.getDashboardMetrics()
      ]);

      setUsers(usersData);
      setPhotos(photosData);
      setMetrics(metricsData);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar dados do servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Ações de Usuário
  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      alert('Erro ao excluir usuário');
      return false;
    }
  };

  // Ações de Fotos
  const approvePhoto = async (id) => {
    try {
      await adminService.approvePhoto(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      alert('Erro ao aprovar foto');
      return false;
    }
  };

  const rejectPhoto = async (id) => {
    try {
      await adminService.rejectPhoto(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      alert('Erro ao rejeitar foto');
      return false;
    }
  };

  return {
    users,
    photos,
    metrics,
    loading,
    error,
    refresh: loadData,
    deleteUser,
    approvePhoto,
    rejectPhoto
  };
}
