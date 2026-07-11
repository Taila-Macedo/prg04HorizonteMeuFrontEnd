import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiFetch } from '../../../shared/utils/apiFetch';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function usePerfilDados() {
  const { usuario, token } = useAuth();

  const [favoritosCompletos, setFavoritosCompletos] = useState([]);
  const [roteiros, setRoteiros] = useState([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false);
  const [carregandoRoteiros, setCarregandoRoteiros] = useState(false);
  const [erro, setErro] = useState('');

  const authHeader = { Authorization: `Bearer ${token}` };

  // Busca favoritos + dados completos de cada ponto turístico
  const carregarFavoritos = useCallback(async () => {
    if (!usuario?.id || !token) return;
    setCarregandoFavoritos(true);
    try {
      const res = await apiFetch(`${BASE}/favoritos/usuario/${usuario.id}`, {
        headers: authHeader,
      });
      if (!res.ok) throw new Error('Erro ao carregar favoritos.');
      const favs = await res.json(); // [{ id, dataSalvo, idPontoTuristico }]

      // Para cada favorito busca os dados completos do ponto
      const comDados = await Promise.all(
        (Array.isArray(favs) ? favs : []).map(async (fav) => {
          try {
            const resPonto = await apiFetch(`${BASE}/pontos/${fav.idPontoTuristico}`, {
              headers: authHeader,
            });
            const ponto = resPonto.ok ? await resPonto.json() : null;
            return { ...fav, ponto };
          } catch {
            return { ...fav, ponto: null };
          }
        })
      );

      setFavoritosCompletos(comDados.filter((f) => f.ponto !== null));
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregandoFavoritos(false);
    }
  }, [usuario?.id, token]);

  // Busca roteiros do usuário
  const carregarRoteiros = useCallback(async () => {
    if (!usuario?.id || !token) return;
    setCarregandoRoteiros(true);
    try {
      const res = await apiFetch(`${BASE}/roteiros/usuario/${usuario.id}`, {
        headers: authHeader,
      });
      if (!res.ok) throw new Error('Erro ao carregar roteiros.');
      const data = await res.json();
      setRoteiros(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregandoRoteiros(false);
    }
  }, [usuario?.id, token]);

  useEffect(() => {
    carregarFavoritos();
    carregarRoteiros();
  }, [carregarFavoritos, carregarRoteiros]);

  const removerFavorito = async (favoritoId) => {
    try {
      const res = await apiFetch(`${BASE}/favoritos/${favoritoId}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      if (!res.ok) throw new Error('Erro ao remover favorito.');
      setFavoritosCompletos((prev) => prev.filter((f) => f.id !== favoritoId));
      return true;
    } catch (err) {
      setErro(err.message);
      return false;
    }
  };

  const stats = {
    viagens: 0, // não existe na API ainda
    roteiros: roteiros.length,
    favoritos: favoritosCompletos.length,
  };

  return {
    favoritosCompletos,
    roteiros,
    stats,
    carregandoFavoritos,
    carregandoRoteiros,
    erro,
    removerFavorito,
    recarregar: () => { carregarFavoritos(); carregarRoteiros(); },
  };
}