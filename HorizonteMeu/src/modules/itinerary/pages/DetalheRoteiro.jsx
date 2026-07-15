import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Globe,
  Lock,
  Share2,
  Pencil,
  MapPin,
  CheckCircle2,
  Circle,
  Route as RouteIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useDetalheRoteiro } from '../hooks/useDetalheRoteiro';
import '../styles/DetalheRoteiro.css';

export default function DetalheRoteiro() {
  const {
    roteiro,
    loading,
    naoEncontrado,
    compartilhando,
    linkCopiado,
    totalPontos,
    pontosVisitados,
    progresso,
    souDono,
    formatarData,
    toggleVisitado,
    handleCompartilhar,
    navigate,
  } = useDetalheRoteiro();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dr-loading">
        <div className="dr-spinner" />
        <p>Carregando roteiro...</p>
      </div>
    );
  }

  // ── Não encontrado ───────────────────────────────────────────────────────
  if (naoEncontrado || !roteiro) {
    return (
      <div className="dr-nao-encontrado">
        <Navigation esconderBusca />
        <div className="dr-nao-encontrado-content">
          <RouteIcon size={64} opacity={0.3} />
          <h2>Roteiro não encontrado</h2>
          <p>Este roteiro não existe ou foi removido.</p>
          <button className="dr-btn-voltar-lista" onClick={() => navigate('/roteiros')}>
            Voltar aos meus roteiros
          </button>
        </div>
      </div>
    );
  }

  // ── Tela principal ───────────────────────────────────────────────────────
  return (
    <div className="dr-container">
      <Navigation esconderBusca />

      <main className="dr-content">

        {/* Botão voltar */}
        <button className="dr-voltar" onClick={() => navigate('/roteiros')}>
          <ArrowLeft size={18} />
          Meus roteiros
        </button>

        {/* ── Cabeçalho do roteiro ── */}
        <section className="dr-header">
          <div className="dr-header-topo">
            {/* Ícone decorativo */}
            <div className="dr-icone">
              <RouteIcon size={28} />
            </div>

            {/* Badge público/privado */}
            <span className={`dr-badge ${roteiro.publico ? 'publico' : 'privado'}`}>
              {roteiro.publico ? <Globe size={12} /> : <Lock size={12} />}
              {roteiro.publico ? 'PÚBLICO' : 'PRIVADO'}
            </span>
          </div>

          <h1 className="dr-titulo">{roteiro.titulo}</h1>

          {roteiro.descricao && (
            <p className="dr-descricao">{roteiro.descricao}</p>
          )}

          {/* Meta: data + criado em */}
          <div className="dr-meta">
            {roteiro.dataViagem && (
              <span className="dr-meta-item">
                <Calendar size={14} />
                Viagem em {formatarData(roteiro.dataViagem)}
              </span>
            )}
            {roteiro.dataCriacao && (
              <span className="dr-meta-item">
                <Calendar size={14} />
                Criado em {formatarData(roteiro.dataCriacao)}
              </span>
            )}
          </div>

          {/* Ações: editar (só o dono) + compartilhar (todo mundo) */}
          <div className="dr-acoes">
            {souDono && (
              <button
                className="dr-btn-editar"
                onClick={() => navigate(`/roteiros/${roteiro.id}/editar`)}
              >
                <Pencil size={16} />
                Editar roteiro
              </button>
            )}

            <button
              className={`dr-btn-compartilhar ${linkCopiado ? 'copiado' : ''}`}
              onClick={handleCompartilhar}
              disabled={compartilhando}
            >
              {linkCopiado ? (
                <>
                  <LinkIcon size={16} />
                  Link copiado!
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  {compartilhando ? 'Compartilhando...' : 'Compartilhar'}
                </>
              )}
            </button>
          </div>
        </section>

        {/* ── Progresso ── */}
        {totalPontos > 0 && (
          <section className="dr-progresso-section">
            <div className="dr-progresso-topo">
              <span className="dr-progresso-label">
                <MapPin size={14} />
                Progresso da viagem
              </span>
              <span className="dr-progresso-contador">
                {pontosVisitados}/{totalPontos} paradas visitadas
              </span>
            </div>
            <div className="dr-progresso-barra">
              <div
                className="dr-progresso-fill"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <span className="dr-progresso-pct">{progresso}%</span>
          </section>
        )}

        {/* ── Lista de pontos ── */}
        <section className="dr-pontos-section">
          <h2 className="dr-pontos-titulo">
            <MapPin size={18} />
            Paradas do roteiro
          </h2>

          {totalPontos === 0 ? (
            // Roteiro sem pontos
            <div className="dr-pontos-vazio">
              <MapPin size={40} opacity={0.3} />
              <p>Este roteiro ainda não tem paradas.</p>
              {souDono && (
                <button
                  className="dr-btn-add-ponto"
                  onClick={() => navigate(`/roteiros/${roteiro.id}/editar`)}
                >
                  Adicionar paradas
                </button>
              )}
            </div>
          ) : (
            <ul className="dr-pontos-lista">
              {/* Ordena pelos campo ordem antes de renderizar */}
              {[...roteiro.pontos]
                .sort((a, b) => a.ordem - b.ordem)
                .map((ponto) => (
                  <li
                    key={ponto.id}
                    className={`dr-ponto-item ${ponto.visitado ? 'visitado' : ''}`}
                  >
                    {/* Número da ordem */}
                    <span className="dr-ponto-ordem">{ponto.ordem}</span>

                    {/* Nome do ponto — clicável se quiser navegar para o detalhe */}
                    <div className="dr-ponto-info">
                      <span className="dr-ponto-nome">{ponto.nomePontoTuristico}</span>
                      {ponto.visitado && (
                        <span className="dr-ponto-visitado-label">Visitado ✓</span>
                      )}
                    </div>

                    {/* Checkbox de visitado — só o dono do roteiro pode marcar */}
                    {souDono ? (
                      <button
                        className="dr-ponto-check"
                        onClick={() => toggleVisitado(ponto.id, ponto.visitado)}
                        title={ponto.visitado ? 'Marcar como não visitado' : 'Marcar como visitado'}
                      >
                        {ponto.visitado ? (
                          <CheckCircle2 size={22} className="check-ativo" />
                        ) : (
                          <Circle size={22} className="check-inativo" />
                        )}
                      </button>
                    ) : (
                      <span className="dr-ponto-check dr-ponto-check-readonly" title="Somente o dono do roteiro pode marcar como visitado">
                        {ponto.visitado ? (
                          <CheckCircle2 size={22} className="check-ativo" />
                        ) : (
                          <Circle size={22} className="check-inativo" />
                        )}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  );
}