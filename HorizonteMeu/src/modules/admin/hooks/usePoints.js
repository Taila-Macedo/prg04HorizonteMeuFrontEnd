import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';

/**
 * Hook customizado para gerenciar pontos turísticos
 */
export function usePoints() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPoints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPoints();
      setPoints(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pontos turísticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPoint = useCallback(async (data) => {
    try {
      const newPoint = await adminService.createPoint(data);
      setPoints(prev => [...prev, newPoint]);
      return true;
    } catch (err) {
      setError('Erro ao criar ponto turístico');
      console.error(err);
      return false;
    }
  }, []);

  const updatePoint = useCallback(async (id, data) => {
    try {
      const updated = await adminService.updatePoint(id, data);
      setPoints(prev => prev.map(p => p.id === id ? updated : p));
      return true;
    } catch (err) {
      setError('Erro ao atualizar ponto turístico');
      console.error(err);
      return false;
    }
  }, []);

  const deletePoint = useCallback(async (id) => {
    try {
      await adminService.deletePoint(id);
      setPoints(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir ponto turístico');
      console.error(err);
      return false;
    }
  }, []);

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
