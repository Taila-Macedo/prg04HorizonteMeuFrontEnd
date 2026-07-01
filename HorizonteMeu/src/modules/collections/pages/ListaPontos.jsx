import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Search, SlidersHorizontal, Plus, AlertCircle } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useListaPontos } from '../hooks/useListaPontos';
import { useAuth } from '../../../shared/contexts/AuthContext';
import '../styles/ListaPontos.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CATEGORIAS = [
  { key: 'TODOS',     label: 'Todos'      },
  { key: 'PRAIA',     label: '🏖️ Praia'   },
  { key: 'MUSEU',     label: '🏛️ Museu'   },
  { key: 'MONTANHA',  label: '⛰️ Montanha' },
  { key: 'MONUMENTO', label: '🗿 Monumento'},
  { key: 'PARQUE',    label: '🌳 Parque'  },
];

function Estrelas({ nota }) {
  return (
    <div className="lp-estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          className={n <= Math.round(nota || 0) ? 'estrela-ativa' : 'estrela-vazia'}
          fill={n <= Math.round(nota || 0) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function ListaPontos() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const isAdmin = usuario?.perfil === 'ADMINISTRADOR';

  const {
    pontos,
    loading,
    erro,
    busca,
    setBusca,
    categoriaAtiva,
    setCategoriaAtiva,
  } = useListaPontos();

  // Mapa idPonto -> url da foto (o objeto do ponto não traz a foto real)
  const [fotosPorPonto, setFotosPorPonto] = useState({});

  useEffect(() => {
    const carregarFotos = async () => {
      if (pontos.length === 0) return;

      const entradas = await Promise.all(
        pontos.map(async (ponto) => {
          try {
            const res = await fetch(`${BASE}/fotos/ponto/${ponto.id}`);
            if (res.ok) {
              const fotosList = await res.json();
              if (Array.isArray(fotosList) && fotosList.length > 0) {
                return [ponto.id, fotosList[0].url];
              }
            }
          } catch {
            // sem foto
          }
          return [ponto.id, null];
        })
      );

      setFotosPorPonto(Object.fromEntries(entradas));
    };

    carregarFotos();
  }, [pontos]);

  return (
    <div className="lp-container">
      <Navigation esconderBusca />

      <main className="lp-content">
        <header className="lp-header">
          <div className="lp-header-info">
            <h1>Explorar Pontos</h1>
            <p>Descubra destinos incríveis ao redor do mundo.</p>
          </div>
          {isAdmin && (
            <button className="btn-novo-ponto" onClick={() => navigate('/pontos/novo')}>
              <Plus size={18} />
              Novo Ponto
            </button>
          )}
        </header>

        {/* Barra de busca */}
        <div className="lp-busca-wrapper">
          <Search size={16} className="lp-busca-icone" />
          <input
            className="lp-busca-input"
            type="text"
            placeholder="Buscar por nome, cidade ou país..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button className="lp-busca-limpar" onClick={() => setBusca('')}>✕</button>
          )}
        </div>

        {/* Filtros de categoria */}
        <div className="lp-filtros">
          <SlidersHorizontal size={14} className="lp-filtros-icone" />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.key}
              className={`lp-filtro-btn ${categoriaAtiva === cat.key ? 'ativo' : ''}`}
              onClick={() => setCategoriaAtiva(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Estado de Erro */}
        {erro && (
          <div className="lp-erro">
            <AlertCircle size={40} />
            <p>{erro}</p>
            <button className="btn-recarregar" onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado de loading */}
        {!erro && loading ? (
          <div className="lp-loading">
            <div className="lp-spinner" />
            <p>Carregando pontos turísticos...</p>
          </div>
        ) : !erro && pontos.length === 0 ? (
          <div className="lp-vazio">
            <MapPin size={40} />
            <p>Nenhum ponto encontrado para sua busca.</p>
            <button className="btn-limpar-filtros" onClick={() => { setBusca(''); setCategoriaAtiva('TODOS'); }}>
              Limpar filtros
            </button>
          </div>
        ) : !erro && (
          <>
            <p className="lp-contagem">{pontos.length} ponto{pontos.length !== 1 ? 's' : ''} encontrado{pontos.length !== 1 ? 's' : ''}</p>
            <div className="lp-grid">
              {pontos.map((ponto) => {
                const fotoUrl = fotosPorPonto[ponto.id];
                return (
                  <div
                    key={ponto.id}
                    className="lp-card"
                    onClick={() => navigate(`/pontos/${ponto.id}`)}
                  >
                    <div className="lp-card-img-wrapper">
                      {fotoUrl ? (
                        <img src={fotoUrl} alt={ponto.nome} className="lp-card-img" />
                      ) : (
                        <div className="lp-card-img-vazio">
                          <MapPin size={28} />
                        </div>
                      )}
                    </div>

                    <div className="lp-card-body">
                      <h3 className="lp-card-nome">{ponto.nome}</h3>
                      <div className="lp-card-local">
                        <MapPin size={12} />
                        <span>{ponto.cidade}, {ponto.pais}</span>
                      </div>
                      <p className="lp-card-descricao">{ponto.descricao}</p>
                      <div className="lp-card-footer">
                        <Estrelas nota={ponto.notaMedia} />
                        <span className="lp-card-nota">{ponto.notaMedia?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}