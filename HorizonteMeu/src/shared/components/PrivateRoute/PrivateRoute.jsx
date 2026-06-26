// src/shared/components/PrivateRoute/PrivateRoute.jsx
//
// Componente que protege rotas que exigem autenticação.
// Se o usuário não estiver logado, redireciona para /login.
// Se ainda estiver carregando a sessão, exibe um loading.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children, apenasAdmin = false }) {
  const { estaLogado, eAdmin, carregando } = useAuth();

  // Aguarda checar o localStorage antes de redirecionar
  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--azul-profundo)',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.9rem',
        gap: '12px',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🧭</span>
        Carregando...
      </div>
    );
  }

  // Não logado → vai para login
  if (!estaLogado) return <Navigate to="/login" replace />;

  // Rota exclusiva de admin e usuário não é admin → volta para dashboard
  if (apenasAdmin && !eAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}