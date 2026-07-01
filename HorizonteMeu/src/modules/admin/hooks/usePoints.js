import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';

/**
 * Hook customizado para gerenciar pontos turísticos (admin)
 */
export function usePoints() {
  const { token } = useAuth();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPoints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPoints(token);
      setPoints(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pontos turísticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createPoint = useCallback(async (data) => {
    try {
      const newPoint = await adminService.createPoint(data, token);
      setPoints(prev => [...prev, newPoint]);
      return true;
    } catch (err) {
      setError('Erro ao criar ponto turístico');
      console.error(err);
      return false;
    }
  }, [token]);

  const updatePoint = useCallback(async (id, data) => {
    try {
      const updated = await adminService.updatePoint(id, data, token);
      setPoints(prev => prev.map(p => p.id === id ? updated : p));
      return true;
    } catch (err) {
      setError('Erro ao atualizar ponto turístico');
      console.error(err);
      return false;
    }
  }, [token]);

  const deletePoint = useCallback(async (id) => {
    try {
      await adminService.deletePoint(id, token);
      setPoints(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir ponto turístico');
      console.error(err);
      return false;
    }
  }, [token]);

  return {
    points,
    loading,
    error,
    loadPoints,
    createPoint,
    updatePoint,
    deletePoint
  };
}