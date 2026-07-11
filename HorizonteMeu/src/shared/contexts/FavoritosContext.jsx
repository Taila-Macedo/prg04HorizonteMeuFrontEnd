import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../utils/apiFetch';

const FavoritosContext = createContext();
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function FavoritosProvider({ children }) {
  const { usuario, token } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarFavoritos = useCallback(async () => {
    if (!usuario || !token) {
      setFavoritos([]);
      return;
    }
    
    try {
      setCarregando(true);
      const res = await apiFetch(`${BASE}/favoritos/usuario/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFavoritos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
    } finally {
      setCarregando(false);
    }
  }, [usuario, token]);

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  const favoritar = async (idPontoTuristico) => {
    if (!usuario || !token) return null;

    try {
      const res = await apiFetch(`${BASE}/favoritos`, {
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

      if (res.ok) {
        const novo = await res.json();
        setFavoritos(prev => [...prev, novo]);
        return novo;
      }
    } catch (err) {
      console.error('Erro ao favoritar:', err);
    }
    return null;
  };

  const removerFavorito = async (favoritoId) => {
    if (!token) return false;

    try {
      const res = await apiFetch(`${BASE}/favoritos/${favoritoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setFavoritos(prev => prev.filter(f => f.id !== favoritoId));
        return true;
      }
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
    }
    return false;
  };

  const isFavoritado = (idPonto) => {
    return favoritos.some(f => f.idPontoTuristico === Number(idPonto));
  };

  const getFavoritoId = (idPonto) => {
    const fav = favoritos.find(f => f.idPontoTuristico === Number(idPonto));
    return fav ? fav.id : null;
  };

  return (
    <FavoritosContext.Provider value={{ 
      favoritos, 
      carregando, 
      favoritar, 
      removerFavorito, 
      isFavoritado, 
      getFavoritoId,
      atualizarFavoritos: carregarFavoritos 
    }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritosContext);