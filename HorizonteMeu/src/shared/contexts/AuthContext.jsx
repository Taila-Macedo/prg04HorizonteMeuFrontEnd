// src/shared/contexts/AuthContext.jsx
//
// Contexto global de autenticação.
// Guarda o token JWT e os dados do usuário logado em memória + localStorage.
// TODO: quando integrar com o back, substituir o loginMock por POST /auth/login

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ─── MOCK DO USUÁRIO LOGADO ──────────────────────────────────────────────────
// TODO: remover quando integrar com POST /auth/login
// Estrutura alinhada com UsuarioGetResponseDto do backend:
// id, nome, email, perfil (USUARIO | ADMINISTRADOR), bio, dataCriacao
const USUARIO_MOCK = {
  id: 1,
  nome: 'Taíla Martins',
  email: 'taila@email.com',
  perfil: 'USUARIO',
  bio: '🌎 Carioca explorando o mundo | ✨ Colecionando horizontes e histórias | ❤️ Amante de gastronomia e arte',
  desde: 'mar/2026',
  stats: { viagens: 23, roteiros: 8, favoritos: 45 },
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao montar, tenta recuperar sessão salva no localStorage
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('hm_token');
    const usuarioSalvo = localStorage.getItem('hm_usuario');

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  // Login — salva token e usuário no estado e no localStorage
  const login = async (email, senha) => {
    // TODO: substituir por POST /auth/login quando a API estiver pronta
    // const res = await fetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
    // const { token, usuario } = await res.json();

    // Simulação: aceita qualquer email/senha por enquanto
    const tokenMock = 'mock-jwt-token-' + Date.now();
    const usuarioLogado = { ...USUARIO_MOCK, email };

    localStorage.setItem('hm_token', tokenMock);
    localStorage.setItem('hm_usuario', JSON.stringify(usuarioLogado));

    setToken(tokenMock);
    setUsuario(usuarioLogado);
  };

  // Logout — limpa estado e localStorage
  const logout = () => {
    localStorage.removeItem('hm_token');
    localStorage.removeItem('hm_usuario');
    setToken(null);
    setUsuario(null);
  };

  const estaLogado = !!token && !!usuario;
  const eAdmin = usuario?.perfil === 'ADMINISTRADOR';

  return (
    <AuthContext.Provider value={{ usuario, token, estaLogado, eAdmin, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir o contexto em qualquer componente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}