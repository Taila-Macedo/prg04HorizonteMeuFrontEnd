// src/shared/contexts/AuthContext.jsx
//
// Contexto global de autenticação.
// Guarda o token JWT e os dados do usuário logado em memória + localStorage.

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

  // Login — chama POST /auth/login e salva token + usuário
  const login = async (email, senha) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // Resposta: { token, id, nome, email, perfil }
    const dados = await res.json();

    const usuarioLogado = {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
      perfil: dados.perfil,
    };

    localStorage.setItem('hm_token', dados.token);
    localStorage.setItem('hm_usuario', JSON.stringify(usuarioLogado));

    setToken(dados.token);
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