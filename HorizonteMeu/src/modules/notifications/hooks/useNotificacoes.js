import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiFetch } from '../../../shared/utils/apiFetch';
import { getNotifPrefs } from '../../../shared/utils/notificacaoPrefs';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useNotificacoes() {
  const { usuario, token } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // GET /notificacoes/usuario/{idUsuario} — já vem ordenado por data desc no backend
  const carregarNotificacoes = useCallback(async () => {
    if (!usuario || !token) return;

    try {
      setCarregando(true);
      setErro('');
      const res = await apiFetch(`${BASE}/notificacoes/usuario/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao carregar notificações.');

      const data = await res.json();
      const lista = Array.isArray(data) ? data : [];

      // Aplica as preferências salvas em Configurações > Notificações —
      // tipos desativados pelo usuário não aparecem na lista nem contam pro badge
      const prefs = getNotifPrefs(usuario.id);
      const filtrada = lista.filter((n) => prefs[n.tipo] !== false);

      setNotificacoes(filtrada);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // PATCH /notificacoes/{id}/lida — atualização otimista, com rollback se der erro
  const marcarComoLida = async (id) => {
    const notificacao = notificacoes.find(n => n.id === id);
    if (!notificacao || notificacao.lida) return;

    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));

    try {
      const res = await apiFetch(`${BASE}/notificacoes/${id}/lida`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao marcar notificação como lida.');
    } catch (err) {
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: false } : n));
      alert(err.message);
    }
  };

  // Não existe endpoint de "marcar todas" no back, então dispara um PATCH
  // por notificação não lida em paralelo.
  const marcarTodasComoLidas = async () => {
    const naoLidas = notificacoes.filter(n => !n.lida);
    if (naoLidas.length === 0) return;

    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));

    try {
      const respostas = await Promise.all(
        naoLidas.map(n =>
          apiFetch(`${BASE}/notificacoes/${n.id}/lida`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      );

      if (respostas.some(res => !res.ok)) {
        throw new Error('Algumas notificações não puderam ser atualizadas.');
      }
    } catch (err) {
      alert(err.message);
      // Se algo falhou, recarrega do servidor pra refletir o estado real
      carregarNotificacoes();
    }
  };

  // DELETE /notificacoes/{id}
  const remover = async (id) => {
    try {
      const res = await apiFetch(`${BASE}/notificacoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao remover notificação.');

      setNotificacoes(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const naoLidasCount = notificacoes.filter(n => !n.lida).length;

  // Formata a data em relativo (há X min / há Xh / ontem / dd/mm/yyyy)
  const formatarData = (dataString) => {
    if (!dataString) return '';

    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHoras < 24) return `há ${diffHoras}h`;
    if (diffDias === 1) return 'ontem';
    if (diffDias < 7) return `há ${diffDias} dias`;
    return data.toLocaleDateString('pt-BR');
  };

  return {
    notificacoes,
    carregando,
    erro,
    naoLidasCount,
    marcarComoLida,
    marcarTodasComoLidas,
    remover,
    formatarData,
    atualizar: carregarNotificacoes,
  };
}