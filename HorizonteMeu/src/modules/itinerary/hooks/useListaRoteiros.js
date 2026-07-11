import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';

import { apiFetch } from '../../../shared/utils/apiFetch';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useListaRoteiros() {
  const { usuario, token } = useAuth();
  const [roteiros, setRoteiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  // Estado de confirmação inline antes de deletar
  const [confirmandoId, setConfirmandoId] = useState(null);

  const carregarRoteiros = useCallback(async () => {
    if (!usuario || !token) return;

    try {
      setLoading(true);
      setErro('');
      const res = await apiFetch(`${BASE}/roteiros/usuario/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao carregar roteiros.');

      const data = await res.json();
      // RoteiroGetResponseDto já vem com "pontos" — derivamos a quantidade aqui
      const lista = (Array.isArray(data) ? data : []).map((r) => ({
        ...r,
        quantidadePontos: r.pontos?.length ?? 0,
      }));
      setRoteiros(lista);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    carregarRoteiros();
  }, [carregarRoteiros]);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Abre a confirmação inline para o roteiro clicado
  const pedirConfirmacao = (id, e) => {
    e.stopPropagation();
    setConfirmandoId(id);
  };

  // Confirma e deleta — DELETE /roteiros/{id}
  const confirmarDelecao = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await apiFetch(`${BASE}/roteiros/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao excluir roteiro.');

      setRoteiros(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmandoId(null);
    }
  };

  // Cancela sem deletar
  const cancelarDelecao = (e) => {
    e.stopPropagation();
    setConfirmandoId(null);
  };

  return {
    roteiros,
    loading,
    erro,
    formatarData,
    confirmandoId,
    pedirConfirmacao,
    confirmarDelecao,
    cancelarDelecao,
  };
}