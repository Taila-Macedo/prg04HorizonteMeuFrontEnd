import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Trash2, Search } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { useFavoritos } from '../hooks/useFavoritos';
import '../styles/Favoritos.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Favoritos() {
  const navigate = useNavigate();
  const { favoritos, carregando, removerFavorito } = useFavoritos();
  const [pontosDetalhados, setPontosDetalhados] = useState([]);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [busca, setBusca] = useState('');
  const [confirmandoId, setConfirmandoId] = useState(null);

  // Como o endpoint de favoritos só traz os IDs, precisamos buscar os detalhes de cada ponto
  useEffect(() => {
    const carregarDetalhesDosPontos = async () => {
      if (favoritos.length === 0) {
        setPontosDetalhados([]);
        return;
      }

      try {
        setCarregandoDetalhes(true);
        const promessas = favoritos.map(async (fav) => {
          const res = await fetch(`${BASE}/pontos/${fav.idPontoTuristico}`);
          if (res.ok) {
            const ponto = await res.json();
            return { ...fav, pontoTuristico: ponto };
          }
          return null;
        });

        const resultados = await Promise.all(promessas);
        setPontosDetalhados(resultados.filter(r => r !== null));
      } catch (err) {
        console.error('Erro ao carregar detalhes dos favoritos:', err);
      } finally {
        setCarregandoDetalhes(false);
      }
    };

    carregarDetalhesDosPontos();
  }, [favoritos]);

  const handleRemover = async (favoritoId) => {
    const sucesso = await removerFavorito(favoritoId);
    if (sucesso) {
      setConfirmandoId(null);
    }
  };

  const favoritosFiltrados = pontosDetalhados.filter((f) => {
    const termo = busca.toLowerCase();
    const p = f.pontoTuristico;
    return (
      p.nome.toLowerCase().includes(termo) ||
      p.cidade.toLowerCase().includes(termo) ||
      p.pais.toLowerCase().includes(termo)
    );
  });

  const isLoading = carregando || carregandoDetalhes;

  return (
    <div className="favoritos-container">
      <Navigation esconderBusca />

      <div className="favoritos-main">

        <div className="favoritos-header">
          <div className="favoritos-titulo">
            <Heart size={24} className="favoritos-icone" fill="currentColor" />
            <h1>Meus Favoritos</h1>
          </div>
          <span className="favoritos-contagem">
            {favoritos.length} {favoritos.length === 1 ? 'lugar salvo' : 'lugares salvos'}
          </span>
        </div>

        {favoritos.length > 0 && (
          <div className="favoritos-busca">
            <Search size={16} className="favoritos-busca-icone" />
            <input
              type="text"
              placeholder="Buscar nos favoritos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="favoritos-busca-input"
            />
          </div>
        )}

        {isLoading && (
          <div className="favoritos-vazio">
            <div className="loading-spinner" />
            <p>Carregando favoritos...</p>
          </div>
        )}

        {!isLoading && favoritos.length === 0 && (
          <div className="favoritos-vazio">
            <Heart size={48} className="vazio-icone" />
            <h2>Nenhum favorito ainda</h2>
            <p>Explore o mapa e salve os lugares que quiser visitar!</p>
            <button className="btn-explorar" onClick={() => navigate('/dashboard')}>
              Explorar destinos
            </button>
          </div>
        )}

        {!isLoading && favoritos.length > 0 && favoritosFiltrados.length === 0 && (
          <div className="favoritos-vazio">
            <Search size={40} className="vazio-icone" />
            <p>Nenhum favorito encontrado para "{busca}"</p>
          </div>
        )}

        {!isLoading && favoritosFiltrados.length > 0 && (
          <div className="favoritos-grid">
            {favoritosFiltrados.map((fav) => {
              const p = fav.pontoTuristico;
              return (
                <div key={fav.id} className="favorito-card">

                  <div className="favorito-img-wrapper" onClick={() => navigate(`/pontos/${p.id}`)}>
                    <img
                      src={p.url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600'}
                      alt={p.nome}
                      className="favorito-img"
                    />
                    <span className="favorito-categoria">
                      {CATEGORIA_LABEL[p.categoria] || p.categoria}
                    </span>
                  </div>

                  <div className="favorito-content">
                    <div className="favorito-info">
                      <h2 className="favorito-nome" onClick={() => navigate(`/pontos/${p.id}`)}>
                        {p.nome}
                      </h2>
                      <div className="favorito-local">
                        <MapPin size={13} />
                        <span>{p.cidade}, {p.pais}</span>
                      </div>
                      <p className="favorito-descricao">{p.descricao}</p>
                    </div>

                    <div className="favorito-footer">
                      <span className="favorito-nota">★ {p.notaMedia?.toFixed(1) || '0.0'}</span>

                      {confirmandoId === fav.id ? (
                        <div className="confirmacao">
                          <span>Remover?</span>
                          <button className="btn-confirmar-sim" onClick={() => handleRemover(fav.id)}>Sim</button>
                          <button className="btn-confirmar-nao" onClick={() => setConfirmandoId(null)}>Não</button>
                        </div>
                      ) : (
                        <button
                          className="btn-remover"
                          onClick={() => setConfirmandoId(fav.id)}
                          title="Remover dos favoritos"
                        >
                          <Trash2 size={15} />
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}