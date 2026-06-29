import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useFavoritos() {
  const { usuario, token } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Carregar todos os favoritos do usuário
  const carregarFavoritos = useCallback(async () => {
    if (!usuario || !token) return;
    
    try {
      setCarregando(true);
      const res = await fetch(`${BASE}/favoritos/usuario/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Erro ao carregar favoritos.');
      
      const data = await res.json();
      setFavoritos(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  // Favoritar um ponto
  const favoritar = async (idPontoTuristico) => {
    if (!usuario || !token) {
      alert('Você precisa estar logado para favoritar.');
      return;
    }

    try {
      const res = await fetch(`${BASE}/favoritos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idUsuario: usuario.id,
          idPontoTuristico: Number(idPontoTuristico)
        })
      });

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(erroData.message || 'Erro ao favoritar.');
      }

      const novoFavorito = await res.json();
      setFavoritos(prev => [...prev, novoFavorito]);
      return novoFavorito;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };

  // Remover favorito
  const removerFavorito = async (favoritoId) => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE}/favoritos/${favoritoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao remover favorito.');

      setFavoritos(prev => prev.filter(f => f.id !== favoritoId));
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  // Verificar se um ponto específico está favoritado
  const isFavoritado = (idPonto) => {
    return favoritos.some(f => f.idPontoTuristico === Number(idPonto));
  };

  // Pegar o ID do favorito para um ponto específico (necessário para o DELETE)
  const getFavoritoId = (idPonto) => {
    const fav = favoritos.find(f => f.idPontoTuristico === Number(idPonto));
    return fav ? fav.id : null;
  };

  return {
    favoritos,
    carregando,
    erro,
    favoritar,
    removerFavorito,
    isFavoritado,
    getFavoritoId,
    atualizarFavoritos: carregarFavoritos
  };
}