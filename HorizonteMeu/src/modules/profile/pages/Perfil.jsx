// src/modules/profile/pages/Perfil.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Map, Heart as HeartIcon, Settings, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import MeuCardDeTeste from '../../../shared/components/Navigation/Card';
import '../styles/Perfil.css';

export default function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('favoritos');

  if (!usuario) return null;

  return (
    <div className="perfil-container">
      <Link to="/dashboard" className="perfil-voltar" title="Voltar para o início">
        <ArrowLeft size={20} />
      </Link>

      <div className="perfil-main">

        <div className="perfil-header">
          <div className="perfil-avatar-fallback">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>

          <div className="perfil-info">
            <h1 className="perfil-nome">{usuario.nome}</h1>
            <p className="perfil-desde">Na plataforma desde {usuario.desde}</p>
            {usuario.bio && <p className="perfil-bio">{usuario.bio}</p>}
          </div>

          <div className="perfil-actions">
            <button className="btn-configuracoes" onClick={() => navigate('/configuracoes')}>
              <Settings size={15} /> Configurações
            </button>
          </div>
        </div>

        <div className="perfil-stats">
          <div className="stat-card">
            <div className="stat-icon viagens"><Plane size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{usuario.stats?.viagens ?? 0}</span>
              <span className="stat-label">Viagens</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon roteiros"><Map size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{usuario.stats?.roteiros ?? 0}</span>
              <span className="stat-label">Roteiros</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon favoritos"><HeartIcon size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{usuario.stats?.favoritos ?? 0}</span>
              <span className="stat-label">Favoritos</span>
            </div>
          </div>
        </div>

        <div className="perfil-tabs">
          <button className={`tab-btn ${abaAtiva === 'favoritos' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('favoritos')}>
            <HeartIcon size={16} /> Favoritos
          </button>
          <button className={`tab-btn ${abaAtiva === 'roteiros' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('roteiros')}>
            <MapPin size={16} /> Roteiros
          </button>
        </div>

        <div className="perfil-gallery-section" style={{ padding: '24px 0' }}>
          {abaAtiva === 'favoritos' ? (
            <div className="perfil-gallery-grid" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <MeuCardDeTeste />
            </div>
          ) : (
            <div className="perfil-empty-state" style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>
              <p>Nenhum roteiro criado ainda.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}