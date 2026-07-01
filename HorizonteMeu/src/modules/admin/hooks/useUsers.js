import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';
import { useAuth } from '../../../shared/contexts/AuthContext';

/**
 * Hook customizado para gerenciar usuários (admin)
 */
export function useUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(token);
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteUser = useCallback(async (id) => {
    try {
      await adminService.deleteUser(id, token);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir usuário');
      console.error(err);
      return false;
    }
  }, [token]);

  const updateUser = useCallback(async (id, data) => {
    try {
      const updated = await adminService.updateUser(id, data, token);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      return true;
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error(err);
      return false;
    }
  }, [token]);

  return {
    users,
    loading,
    error,
    loadUsers,
    deleteUser,
    updateUser
  };
}