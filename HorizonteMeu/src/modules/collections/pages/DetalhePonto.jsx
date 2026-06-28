import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Camera, MessageCircle, Map, Route, X } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { PONTOS_MOCK, FOTOS_MOCK, CATEGORIA_LABEL } from '../../../shared/mocks/mockData';
import { ComentariosSecao } from '../../comments/components/ComentariosSecao';
import '../styles/DetalhePonto.css';

// Achata todos os pontos de todos os países em um único objeto indexado por id
const PONTOS_POR_ID = Object.values(PONTOS_MOCK)
  .flat()
  .reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

function Estrelas({ nota, tamanho = 16 }) {
  return (
    <div className="estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={tamanho}
          className={n <= Math.round(nota) ? 'estrela-ativa' : 'estrela-vazia'}
          fill={n <= Math.round(nota) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function DetalhePonto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const btnFavoritarRef = useRef(null);

  const [ponto, setPonto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [avioes, setAvioes] = useState([]);

  useEffect(() => {
    // TODO: GET /pontos-turisticos/{id}, GET /fotos/ponto/{id}
    setTimeout(() => {
      const pontoEncontrado = PONTOS_POR_ID[Number(id)];
      const fotosEncontradas = FOTOS_MOCK[Number(id)] ?? FOTOS_MOCK[1];

      setPonto(pontoEncontrado ?? null);
      setFotos(fotosEncontradas);
      setCarregando(false);
    }, 400);
  }, [id]);

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${ponto.latitude},${ponto.longitude}`;
    window.open(url, '_blank');
  };

  const toggleFavorito = () => {
    if (favoritado) {
      setFavoritado(false);
      return;
    }

    const origem = btnFavoritarRef.current?.getBoundingClientRect();
    const destino = navRef.current?.getPosicaoCoracao();

    if (origem && destino) {
      const novoAviao = {
        id: Date.now(),
        x: origem.left + origem.width / 2,
        y: origem.top + origem.height / 2,
        destinoX: destino.left + destino.width / 2,
        destinoY: destino.top + destino.height / 2,
      };
      setAvioes((prev) => [...prev, novoAviao]);

      setTimeout(() => {
        setAvioes((prev) => prev.filter((a) => a.id !== novoAviao.id));
        setFavoritado(true);
      }, 1100);
    } else {
      setFavoritado(true);
    }
  };

  if (carregando) {
    return (
      <div className="detalhe-loading">
        <div className="loading-spinner" />
        <p>Carregando ponto turístico...</p>
      </div>
    );
  }

  if (!ponto) {
    return (
      <div className="detalhe-loading">
        <p>Ponto turístico não encontrado.</p>
        <button onClick={() => navigate('/dashboard')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="detalhe-container">

      {avioes.map((aviao) => (
        <AviaoAnimado key={aviao.id} {...aviao} />
      ))}

      <Navigation ref={navRef} esconderBusca favoritado={favoritado} />

      <div className="detalhe-hero">
        {fotos.length > 0 ? (
          <>
            <img className="detalhe-hero-img" src={fotos[fotoAtiva]?.url} alt={ponto.nome} />
            {fotos.length > 1 && (
              <div className="detalhe-thumbnails">
                {fotos.map((foto, i) => (
                  <button
                    key={foto.id}
                    className={`thumbnail-btn ${i === fotoAtiva ? 'ativa' : ''}`}
                    onClick={() => setFotoAtiva(i)}
                  >
                    <img src={foto.url} alt={`Foto ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="detalhe-hero-vazio">
            <Camera size={40} />
            <span>Sem fotos cadastradas</span>
          </div>
        )}
        <span className="detalhe-categoria-badge">
          {CATEGORIA_LABEL[ponto.categoriaEnum] || ponto.categoria}
        </span>
      </div>

      <div className="detalhe-main">

        <div className="detalhe-cabecalho">
          <div className="detalhe-cabecalho-info">
            <h1 className="detalhe-nome">{ponto.nome}</h1>
            <div className="detalhe-localizacao">
              <MapPin size={15} />
              <span>{ponto.cidade}, {ponto.pais}</span>
            </div>
          </div>
          <div className="detalhe-nota">
            <Estrelas nota={ponto.notaMedia} tamanho={18} />
            <span className="nota-valor">{ponto.notaMedia?.toFixed(1)}</span>
          </div>
        </div>

        <div className="detalhe-acoes">
          <button
            ref={btnFavoritarRef}
            className={`btn-acao ${favoritado ? 'ativo-vermelho' : ''}`}
            onClick={toggleFavorito}
            title={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={17} fill={favoritado ? 'currentColor' : 'none'} />
            {favoritado ? 'Favoritado' : 'Favoritar'}
          </button>

          <button className="btn-acao ativo-azul" onClick={abrirGoogleMaps} title="Ver no Google Maps">
            <Map size={17} />
            Ver no mapa
          </button>

          <button className="btn-acao desabilitado" title="Disponível em breve" disabled>
            <Camera size={17} />
            Enviar foto
          </button>

          <button className="btn-acao desabilitado" title="Disponível após criar um roteiro" disabled>
            <Route size={17} />
            Add. ao roteiro
          </button>
        </div>

        <p className="detalhe-descricao">{ponto.descricao}</p>

        <div className="detalhe-secao-titulo">
          <MessageCircle size={18} />
          <h2>Avaliações</h2>
        </div>

        <div className="detalhe-comentarios">
          <ComentariosSecao pontoId={id} />
        </div>
      </div>
    </div>
  );
}

function AviaoAnimado({ x, y, destinoX, destinoY }) {
  const dx = destinoX - x;
  const dy = destinoY - y;
  const angulo = Math.atan2(dy, dx) * (180 / Math.PI);

  const estilo = {
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    left: `${x}px`,
    top: `${y}px`,
    '--angulo-inicial': `${angulo}deg`,
  };

  return (
    <div className="aviao-wrapper" style={estilo}>
      <div className="aviao-fumaça-trail" />
      <span className="aviao-emoji">✈️</span>
    </div>
  );
}