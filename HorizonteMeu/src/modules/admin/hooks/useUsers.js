import { useState, useCallback } from 'react';
import { adminService } from './useAdminService';

/**
 * Hook customizado para gerenciar usuários
 */
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    } catch (err) {
      setError('Erro ao excluir usuário');
      console.error(err);
      return false;
    }
  }, []);

  const updateUser = useCallback(async (id, data) => {
    try {
      const updated = await adminService.updateUser(id, data);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      return true;
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error(err);
      return false;
    }
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    deleteUser,
    updateUser
  };
}
