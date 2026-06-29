import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Bell, Route, User, MapPin } from 'lucide-react';
import './Navigation.css';

export const Navigation = forwardRef(function Navigation(
  { aoPesquisar, esconderBusca = false },
  ref
) {
  const [pesquisa, setPesquisa] = useState('');
  const [coracaoPulsando, setCoracaoPulsando] = useState(false);
  const coracaoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getPosicaoCoracao: () => {
      if (!coracaoRef.current) return null;
      return coracaoRef.current.getBoundingClientRect();
    },
    // Novo método: faz o coração da navbar pulsar por 800ms
    pulsarCoracao: () => {
      setCoracaoPulsando(true);
      setTimeout(() => setCoracaoPulsando(false), 800);
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

        <Link to="/favoritos" className="nav-action-btn" title="Favoritos" ref={coracaoRef}>
          <Heart
            size={20}
            className={`nav-coracao ${coracaoPulsando ? 'nav-coracao-pulsando' : ''}`}
            fill={coracaoPulsando ? 'currentColor' : 'none'}
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