import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';

/**
 * Hook customizado para gerenciar fotos
 */
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingPhotos();
      setPhotos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fotos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const approvePhoto = useCallback(async (id) => {
    try {
      await adminService.approvePhoto(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao aprovar foto');
      console.error(err);
      return false;
    }
  }, []);

  const rejectPhoto = useCallback(async (id) => {
    try {
      await adminService.rejectPhoto(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao rejeitar foto');
      console.error(err);
      return false;
    }
  }, []);

  return {
    photos,
    loading,
    error,
    loadPhotos,
    approvePhoto,
    rejectPhoto
  };
}
