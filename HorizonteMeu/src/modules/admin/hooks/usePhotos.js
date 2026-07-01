import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';

/**
 * Hook customizado para gerenciar fotos (admin)
 */
export function usePhotos() {
  const { token } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingPhotos(token);
      setPhotos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fotos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approvePhoto = useCallback(async (id) => {
    try {
      await adminService.approvePhoto(id, token);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao aprovar foto');
      console.error(err);
      return false;
    }
  }, [token]);

  const rejectPhoto = useCallback(async (id) => {
    try {
      await adminService.rejectPhoto(id, token);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao rejeitar foto');
      console.error(err);
      return false;
    }
  }, [token]);

  return {
    photos,
    loading,
    error,
    loadPhotos,
    approvePhoto,
    rejectPhoto
  };
}