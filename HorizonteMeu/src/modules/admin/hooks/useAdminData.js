import { useState, useEffect, useCallback } from 'react';
import { adminService } from './useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';

export function useAdminData() {
  const { token } = useAuth();

  const [users,   setUsers]   = useState([]);
  const [photos,  setPhotos]  = useState([]);
  const [points,  setPoints]  = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersData, photosData, pointsData] = await Promise.all([
        adminService.getUsers(token).catch(() => []),
        adminService.getPendingPhotos(token).catch(() => []),
        adminService.getPoints(token).catch(() => []),
      ]);
      setUsers(usersData);
      setPhotos(photosData);
      setPoints(pointsData);
      setMetrics({
        usersCount:         usersData.length,
        pointsCount:        pointsData.length,
        pendingPhotosCount: photosData.length,
        pendingReportsCount: 0,
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

  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id, token);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  const updateUser = async (id, dados) => {
    try {
      const atualizado = await adminService.updateUser(id, dados, token);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...atualizado } : u));
      return true;
    } catch (err) { console.error(err); return false; }
  };

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

  return {
    users, photos, points, metrics,
    loading, error,
    refresh: loadData,
    deleteUser, updateUser,
    approvePhoto, rejectPhoto,
  };
}