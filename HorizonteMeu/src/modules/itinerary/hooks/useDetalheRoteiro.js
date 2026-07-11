import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiFetch } from '../../../shared/utils/apiFetch';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useDetalheRoteiro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [roteiro, setRoteiro]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  const [compartilhando, setCompartilhando] = useState(false);
  const [linkCopiado, setLinkCopiado]       = useState(false);

  // Carrega o roteiro pelo id da URL — GET /roteiros/{id}
  const carregar = useCallback(async () => {
    setLoading(true);
    setNaoEncontrado(false);
    try {
      const res = await apiFetch(`${BASE}/roteiros/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        setNaoEncontrado(true);
        return;
      }

      const dado = await res.json();
      setRoteiro(dado);
    } catch (err) {
      console.error('Erro ao carregar roteiro:', err);
      setNaoEncontrado(true);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Formata "2025-07-15" → "15/07/2025"
  const formatarData = (dataString) => {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Alterna o campo visitado de um ponto do roteiro
  // PATCH /roteiros/pontos/{idRoteiroPonto}?visitado=true|false
  const toggleVisitado = async (idRoteiroPonto, valorAtual) => {
    const novoValor = !valorAtual;

    // Atualiza otimistamente na tela
    setRoteiro((prev) => ({
      ...prev,
      pontos: prev.pontos.map((p) =>
        p.id === idRoteiroPonto ? { ...p, visitado: novoValor } : p
      ),
    }));

    try {
      const res = await apiFetch(
        `${BASE}/roteiros/pontos/${idRoteiroPonto}?visitado=${novoValor}`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Erro ao atualizar visitado.');
    } catch (err) {
      // Reverte se a API falhar
      console.error('Erro ao atualizar visitado:', err);
      setRoteiro((prev) => ({
        ...prev,
        pontos: prev.pontos.map((p) =>
          p.id === idRoteiroPonto ? { ...p, visitado: valorAtual } : p
        ),
      }));
    }
  };

  // Torna o roteiro público e copia o link — PATCH /roteiros/{id}/compartilhar
  const handleCompartilhar = async () => {
    if (compartilhando) return;
    setCompartilhando(true);
    try {
      const res = await apiFetch(`${BASE}/roteiros/${id}/compartilhar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao compartilhar roteiro.');

      const atualizado = await res.json();
      setRoteiro(atualizado);

      const link = `${window.location.origin}/roteiros/${id}`;
      await navigator.clipboard.writeText(link);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      alert(err.message);
    } finally {
      setCompartilhando(false);
    }
  };

  const totalPontos     = roteiro?.pontos?.length ?? 0;
  const pontosVisitados = roteiro?.pontos?.filter((p) => p.visitado).length ?? 0;
  const progresso       = totalPontos > 0 ? Math.round((pontosVisitados / totalPontos) * 100) : 0;

  return {
    roteiro,
    loading,
    naoEncontrado,
    compartilhando,
    linkCopiado,
    totalPontos,
    pontosVisitados,
    progresso,
    formatarData,
    toggleVisitado,
    handleCompartilhar,
    navigate,
  };
}