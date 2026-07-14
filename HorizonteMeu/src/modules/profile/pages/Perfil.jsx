import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map, Heart as HeartIcon, Settings,
  MapPin, ArrowLeft, Star, Trash2, Landmark,
} from 'lucide-react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { usePerfilDados } from '../hooks/usePerfilDados';
import '../styles/Perfil.css';

// ─── Card inline de favorito ───────────────────────────────────────────────
function CardFavorito({ favorito, onRemover }) {
  const navigate = useNavigate();
  const { ponto, id: favId } = favorito;

  if (!ponto) return null;

  return (
    <div className="perfil-fav-card" style={{ cursor: 'pointer' }}>
      <div className="perfil-fav-image-wrap" onClick={() => navigate(`/pontos/${ponto.id}`)}>
        {ponto.fotoUrl ? (
          <img
            src={ponto.fotoUrl}
            alt={ponto.nome}
            className="perfil-fav-image"
          />
        ) : (
          // Ponto sem foto aprovada na galeria ainda — exibe placeholder
          <div className="perfil-fav-image perfil-fav-image-placeholder">
            🗺️
          </div>
        )}
        <div className="perfil-fav-tag">
          <Landmark size={11} />
          {ponto.categoria}
        </div>
      </div>

      <div className="content">
        <h2 onClick={() => navigate(`/pontos/${ponto.id}`)}>{ponto.nome}</h2>

        <div className="details">
          <span className="item">
            <MapPin size={12} className="material-icon" />
            <em>{ponto.cidade}, {ponto.pais}</em>
          </span>
        </div>

        <p className="card-descricao-curta">{ponto.descricao}</p>

        <div className="card-footer">
          <div className="rating">
            <Star size={14} fill="#ffb703" stroke="#ffb703" />
            <span>{ponto.notaMedia?.toFixed(1) ?? '0.0'}</span>
          </div>

          <div className="buttons-group">
            <button
              className="primary-btn-details"
              onClick={() => navigate(`/pontos/${ponto.id}`)}
            >
              Ver detalhes
            </button>
            <button
              className="icon-btn-favorite active"
              onClick={() => onRemover(favId)}
              title="Remover dos Favoritos"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card inline de roteiro ────────────────────────────────────────────────
function CardRoteiro({ roteiro }) {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/roteiros/${roteiro.id}`)}
    >
      <div className="content" style={{ padding: '20px' }}>
        <h2>{roteiro.titulo}</h2>
        {roteiro.descricao && (
          <p className="card-descricao-curta">{roteiro.descricao}</p>
        )}
        {roteiro.dataViagem && (
          <div className="details" style={{ marginTop: '8px' }}>
            <span className="item">
              <Map size={12} />
              <em>Viagem: {new Date(roteiro.dataViagem).toLocaleDateString('pt-BR')}</em>
            </span>
          </div>
        )}
        <div className="card-footer" style={{ marginTop: '12px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            {roteiro.pontos?.length ?? 0} ponto(s)
          </span>
          {roteiro.publico && (
            <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>🔗 Público</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────
export default function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('favoritos');

  const {
    favoritosCompletos,
    roteiros,
    stats,
    carregandoFavoritos,
    carregandoRoteiros,
    erro,
    removerFavorito,
  } = usePerfilDados();

  if (!usuario) return null;

  return (
    <div className="perfil-container">
      <Link to="/dashboard" className="perfil-voltar" title="Voltar para o início">
        <ArrowLeft size={20} />
      </Link>

      <div className="perfil-main">

        {/* ── Cabeçalho ── */}
        <div className="perfil-header">
          {usuario.fotoPerfil ? (
            <img src={usuario.fotoPerfil} alt={usuario.nome} className="perfil-avatar" />
          ) : (
            <div className="perfil-avatar-fallback">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          )}

          <div className="perfil-info">
            <h1 className="perfil-nome">{usuario.nome}</h1>
            {/* "desde" removido pois a API não retorna essa data */}
            {usuario.bio && <p className="perfil-bio">{usuario.bio}</p>}
          </div>

          <div className="perfil-actions">
            <button className="btn-configuracoes" onClick={() => navigate('/configuracoes')}>
              <Settings size={15} /> Configurações
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="perfil-stats">
          <div className="stat-card">
            <div className="stat-icon roteiros"><Map size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{stats.roteiros}</span>
              <span className="stat-label">Roteiros</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon favoritos"><HeartIcon size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{stats.favoritos}</span>
              <span className="stat-label">Favoritos</span>
            </div>
          </div>
        </div>

        {/* ── Abas ── */}
        <div className="perfil-tabs">
          <button
            className={`tab-btn ${abaAtiva === 'favoritos' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('favoritos')}
          >
            <HeartIcon size={16} /> Favoritos
          </button>
          <button
            className={`tab-btn ${abaAtiva === 'roteiros' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('roteiros')}
          >
            <MapPin size={16} /> Roteiros
          </button>
        </div>

        {/* ── Conteúdo das abas ── */}
        {erro && (
          <p style={{ textAlign: 'center', color: '#f87171', marginBottom: '16px' }}>
            {erro}
          </p>
        )}

        <div className="perfil-gallery-section" style={{ padding: '24px 0' }}>

          {/* Aba Favoritos */}
          {abaAtiva === 'favoritos' && (
            carregandoFavoritos ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                Carregando favoritos...
              </p>
            ) : favoritosCompletos.length === 0 ? (
              <div className="perfil-empty-state" style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>
                <p>Você ainda não tem favoritos salvos.</p>
              </div>
            ) : (
              <div
                className="perfil-gallery-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {favoritosCompletos.map((fav) => (
                  <CardFavorito
                    key={fav.id}
                    favorito={fav}
                    onRemover={removerFavorito}
                  />
                ))}
              </div>
            )
          )}

          {/* Aba Roteiros */}
          {abaAtiva === 'roteiros' && (
            carregandoRoteiros ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                Carregando roteiros...
              </p>
            ) : roteiros.length === 0 ? (
              <div className="perfil-empty-state" style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>
                <p>Nenhum roteiro criado ainda.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {roteiros.map((r) => (
                  <CardRoteiro key={r.id} roteiro={r} />
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}