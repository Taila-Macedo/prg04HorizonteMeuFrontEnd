import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Search, Heart, Bell, Sparkles, Route, User } from 'lucide-react';
import './Navigation.css'; 

export function Navigation() {
  const [pesquisa, setPesquisa] = useState('');

  // Adicionamos a propriedade "to" nos itens para sabermos para onde ir
  const navItems = [
    { icon: <Route size={20} />, label: 'Roteiros', id: 'roteiros', to: '/' },
    { icon: <Heart size={20} />, label: 'Favoritos', id: 'favoritos', to: '/' },
    { icon: <Sparkles size={20} />, label: 'Sugestões IA', id: 'sugestoes', to: '/' }
  ];

  return (
    <header className="navigation-header">
      
      {/* Lado Esquerdo: Nome do Sistema */}
      <span className="navigation-logo">
        🧭 <span className="text-logo">Horizonte Meu</span>
      </span>

      {/* Centro: Barra de Pesquisa */}
      <div className="navigation-search">
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="navigation-input"
        />
        <Search 
          size={18} 
          color="rgba(255, 255, 255, 0.4)" 
          className="navigation-search-icon"
        />
      </div>

      {/* Lado Direito: Notificações, Ícones Dinâmicos e Perfil */}
      <div className="navigation-actions">
        
        {navItems.map((item) => (
          <Link 
            key={item.id} 
            to={item.to} 
            className="nav-action-btn" 
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}

        <button className="nav-notification-button" title="Notificações">
          <Bell size={22} color="#ffffff" />
          <span className="nav-notification-badge"></span>
        </button>

        {/* TRANSFORMAÇÃO AQUI: Trocamos as divs antigas por um <Link> apontando para /login */}
        <Link to="/login" className="nav-user-profile" title="Meu Perfil">
          <div className="nav-user-avatar">
            <User size={20} color="#ffffff" />
          </div>
        </Link>

      </div>
    </header>
  );
}