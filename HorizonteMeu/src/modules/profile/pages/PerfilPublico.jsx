import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Map, MapPin, ArrowLeft, Flag, X, UserX } from 'lucide-react';
import { usePerfilPublico } from '../hooks/usePerfilPublico';
import { CardRoteiro } from './Perfil';
import '../styles/Perfil.css';
import '../../comments/styles/Comentarios.css';

export default function PerfilPublico() {
  const { id } = useParams();

  const {
    perfil,
    roteirosPublicos,
    carregando,
    disponivel,
    erro,
    ehProprioPerfil,
    denunciaModal,
    motivoDenuncia,
    setMotivoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
    enviandoDenuncia,
  } = usePerfilPublico(id);

  if (ehProprioPerfil) {
    return <Navigate to="/perfil" replace />;
  }

  if (carregando) {
    return (
      <div className="perfil-container">
        <div className="perfil-main">
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', paddingTop: '80px' }}>
            Carregando perfil...
          </p>
        </div>
      </div>
    );
  }

  if (!disponivel) {
    return (
      <div className="perfil-container">
        <Link to="/dashboard" className="perfil-voltar" title="Voltar para o início">
          <ArrowLeft size={20} />
        </Link>
        <div className="perfil-main">
          <div
            className="perfil-empty-state"
            style={{
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
              padding: '100px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <UserX size={40} />
            <p style={{ fontSize: '1.05rem' }}>Perfil indisponível.</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
              Este usuário não existe mais ou a conta foi removida.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <Link to="/dashboard" className="perfil-voltar" title="Voltar para o início">
        <ArrowLeft size={20} />
      </Link>

      <div className="perfil-main">

        <div className="perfil-header">
          {perfil?.fotoPerfil ? (
            <img src={perfil.fotoPerfil} alt={perfil.nome} className="perfil-avatar" />
          ) : (
            <div className="perfil-avatar-fallback">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          )}

          <div className="perfil-info">
            <h1 className="perfil-nome">{perfil?.nome}</h1>
            {perfil?.bio && <p className="perfil-bio">{perfil.bio}</p>}
          </div>

          <div className="perfil-actions">
            <button className="btn-configuracoes" onClick={abrirDenuncia}>
              <Flag size={15} /> Denunciar
            </button>
          </div>
        </div>

        <div className="perfil-stats">
          <div className="stat-card">
            <div className="stat-icon roteiros"><Map size={20} /></div>
            <div className="stat-info">
              <span className="stat-numero">{roteirosPublicos.length}</span>
              <span className="stat-label">Roteiros públicos</span>
            </div>
          </div>
        </div>

        {erro && (
          <p style={{ textAlign: 'center', color: '#f87171', marginBottom: '16px' }}>
            {erro}
          </p>
        )}

        <div className="perfil-gallery-section" style={{ padding: '24px 0' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin size={16} /> Roteiros públicos
          </h3>

          {roteirosPublicos.length === 0 ? (
            <div className="perfil-empty-state" style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>
              <p>Este usuário ainda não tem roteiros públicos.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {roteirosPublicos.map((r) => (
                <CardRoteiro key={r.id} roteiro={r} />
              ))}
            </div>
          )}
        </div>
      </div>

      {denunciaModal && (
        <div className="modal-overlay" onClick={fecharDenuncia}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Denunciar perfil</h3>
              <button className="modal-fechar" onClick={fecharDenuncia}>
                <X size={18} />
              </button>
            </div>
            <p className="modal-descricao">Qual o motivo da denúncia?</p>
            <div className="modal-opcoes">
              {['Perfil falso', 'Conteúdo ofensivo', 'Assédio', 'Spam', 'Outro'].map((op) => (
                <button
                  key={op}
                  className={`modal-opcao ${motivoDenuncia === op ? 'selecionada' : ''}`}
                  onClick={() => setMotivoDenuncia(op)}
                >
                  {op}
                </button>
              ))}
            </div>
            <button
              className="btn-enviar-denuncia"
              onClick={enviarDenuncia}
              disabled={!motivoDenuncia || enviandoDenuncia}
            >
              {enviandoDenuncia ? 'Enviando...' : 'Enviar denúncia'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}