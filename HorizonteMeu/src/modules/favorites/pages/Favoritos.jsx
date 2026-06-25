import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Trash2, Search } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import '../styles/Favoritos.css';

// --- DADOS MOCK (remover quando integrar com o back) ---
const FAVORITOS_MOCK = [
  {
    id: 1,
    pontoTuristico: {
      id: 1,
      nome: 'Torre Eiffel',
      cidade: 'Paris',
      pais: 'França',
      categoria: 'MONUMENTO',
      notaMedia: 4.8,
      descricao: 'Um dos monumentos mais famosos do mundo, com vista deslumbrante de toda Paris.',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    },
    dataSalvo: '2025-03-10',
  },
  {
    id: 2,
    pontoTuristico: {
      id: 2,
      nome: 'Machu Picchu',
      cidade: 'Cusco',
      pais: 'Peru',
      categoria: 'MONUMENTO',
      notaMedia: 4.9,
      descricao: 'Cidadela inca situada no alto dos Andes peruanos, Patrimônio Mundial da UNESCO.',
      url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    },
    dataSalvo: '2025-04-02',
  },
  {
    id: 3,
    pontoTuristico: {
      id: 3,
      nome: 'Parque Nacional de Yellowstone',
      cidade: 'Wyoming',
      pais: 'EUA',
      categoria: 'PARQUE',
      notaMedia: 4.7,
      descricao: 'Primeiro parque nacional do mundo, famoso pelos gêiseres e vida selvagem abundante.',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    },
    dataSalvo: '2025-05-18',
  },
];

const CATEGORIA_LABEL = {
  PRAIA: '🏖️ Praia',
  MUSEU: '🏛️ Museu',
  MONTANHA: '⛰️ Montanha',
  MONUMENTO: '🗿 Monumento',
  PARQUE: '🌳 Parque',
};

export default function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [confirmandoId, setConfirmandoId] = useState(null);

  useEffect(() => {
    // TODO: GET /favoritos/usuario/{idUsuario}
    setTimeout(() => {
      setFavoritos(FAVORITOS_MOCK);
      setCarregando(false);
    }, 400);
  }, []);

  const removerFavorito = (favoritoId) => {
    // TODO: DELETE /favoritos/{id}
    setFavoritos((prev) => prev.filter((f) => f.id !== favoritoId));
    setConfirmandoId(null);
  };

  const favoritosFiltrados = favoritos.filter((f) => {
    const termo = busca.toLowerCase();
    const p = f.pontoTuristico;
    return (
      p.nome.toLowerCase().includes(termo) ||
      p.cidade.toLowerCase().includes(termo) ||
      p.pais.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="favoritos-container">
      <Navigation esconderBusca />

      <div className="favoritos-main">

        {/* Cabeçalho */}
        <div className="favoritos-header">
          <div className="favoritos-titulo">
            <Heart size={24} className="favoritos-icone" fill="currentColor" />
            <h1>Meus Favoritos</h1>
          </div>
          <span className="favoritos-contagem">
            {favoritos.length} {favoritos.length === 1 ? 'lugar salvo' : 'lugares salvos'}
          </span>
        </div>

        {/* Busca */}
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

        {/* Estado de carregando */}
        {carregando && (
          <div className="favoritos-vazio">
            <div className="loading-spinner" />
            <p>Carregando favoritos...</p>
          </div>
        )}

        {/* Lista vazia */}
        {!carregando && favoritos.length === 0 && (
          <div className="favoritos-vazio">
            <Heart size={48} className="vazio-icone" />
            <h2>Nenhum favorito ainda</h2>
            <p>Explore o mapa e salve os lugares que quiser visitar!</p>
            <button className="btn-explorar" onClick={() => navigate('/dashboard')}>
              Explorar destinos
            </button>
          </div>
        )}

        {/* Sem resultados na busca */}
        {!carregando && favoritos.length > 0 && favoritosFiltrados.length === 0 && (
          <div className="favoritos-vazio">
            <Search size={40} className="vazio-icone" />
            <p>Nenhum favorito encontrado para "{busca}"</p>
          </div>
        )}

        {/* Grid de favoritos */}
        {!carregando && favoritosFiltrados.length > 0 && (
          <div className="favoritos-grid">
            {favoritosFiltrados.map((fav) => {
              const p = fav.pontoTuristico;
              return (
                <div key={fav.id} className="favorito-card">

                  {/* Imagem */}
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

                  {/* Conteúdo */}
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

                    {/* Rodapé do card */}
                    <div className="favorito-footer">
                      <span className="favorito-nota">★ {p.notaMedia?.toFixed(1)}</span>

                      {confirmandoId === fav.id ? (
                        <div className="confirmacao">
                          <span>Remover?</span>
                          <button className="btn-confirmar-sim" onClick={() => removerFavorito(fav.id)}>Sim</button>
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