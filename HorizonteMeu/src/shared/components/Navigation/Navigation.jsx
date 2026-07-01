import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Bell, Route, User, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

export const Navigation = forwardRef(function Navigation(
  { aoPesquisar, esconderBusca = false },
  ref
) {
  const { usuario, estaLogado, eAdmin } = useAuth();
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

        {/* TODO: apontar para /notificacoes quando o módulo notifications/ for implementado */}
        <Link to="/perfil" className="nav-action-btn nav-notificacao" title="Notificações">
          <Bell size={20} />
          <span className="nav-notification-badge"></span>
        </Link>

        {/* Painel de Admin — só aparece pra quem tem perfil ADMINISTRADOR */}
        {eAdmin && (
          <Link to="/admin" className="nav-action-btn" title="Painel de Admin">
            <ShieldCheck size={20} />
          </Link>
        )}

        {/* Botão de conta: se logado, leva ao perfil (mostra avatar/nome);
            se por algum motivo cair aqui deslogado, leva ao login */}
        <Link
          to={estaLogado ? '/perfil' : '/login'}
          className="nav-action-btn"
          title={estaLogado ? usuario?.nome || 'Meu Perfil' : 'Entrar'}
        >
          <div className="nav-user-avatar">
            {estaLogado && usuario?.fotoPerfil ? (
              <img
                src={usuario.fotoPerfil}
                alt={usuario.nome}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <User size={20} color="#ffffff" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
});