import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Bell, Sparkles, Route, User, MapPin } from 'lucide-react';
import './Navigation.css';

// Navigation exportado com forwardRef para que o DetalhePonto
// consiga pegar a posição do coração via ref
export const Navigation = forwardRef(function Navigation(
  { aoPesquisar, esconderBusca = false, favoritado = false },
  ref
) {
  const [pesquisa, setPesquisa] = useState('');
  const coracaoRef = useRef(null);

  // Expõe a posição do coração para o componente pai
  useImperativeHandle(ref, () => ({
    getPosicaoCoracao: () => {
      if (!coracaoRef.current) return null;
      return coracaoRef.current.getBoundingClientRect();
    }
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && aoPesquisar) aoPesquisar(pesquisa);
  };

  return (
    <header className="navigation-header">

      <Link to="/dashboard" className="navigation-logo">
        🧭 <span className="text-logo">Horizonte Meu</span>
      </Link>

      {!esconderBusca && (
        <div className="navigation-search">
          <input
            type="text"
            placeholder="Pesquisar por país..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={handleKeyDown}
            className="navigation-input"
          />
          <Search size={18} color="rgba(255, 255, 255, 0.4)" className="navigation-search-icon" />
        </div>
      )}

      <div className="navigation-actions">

        <Link to="/pontos" className="nav-action-btn" title="Explorar Pontos">
          <MapPin size={20} />
        </Link>

        <Link to="/roteiros" className="nav-action-btn" title="Roteiros">
          <Route size={20} />
        </Link>

        {/* Coração de favoritos — fica vermelho quando favoritado */}
        <Link to="/favoritos" className="nav-action-btn" title="Favoritos" ref={coracaoRef}>
          <Heart
            size={20}
            className={`nav-coracao ${favoritado ? 'nav-coracao-ativo' : ''}`}
            fill={favoritado ? 'currentColor' : 'none'}
          />
        </Link>

       
        <Link to="/perfil" className="nav-action-btn nav-notificacao" title="Notificações">
          <Bell size={20} />
          <span className="nav-notification-badge"></span>
        </Link>

        <Link to="/admin" className="nav-action-btn" title="Painel de Admin">
          <div className="nav-user-avatar">
            <User size={20} color="#ffffff" />
          </div>
        </Link>

      </div>
    </header>
  );
});