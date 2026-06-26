import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Camera, MessageCircle, Map, Route, Flag, X, ImagePlus } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { PONTOS_MOCK, FOTOS_MOCK, COMENTARIOS_MOCK, CATEGORIA_LABEL } from '../../../shared/mocks/mockData';
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
  const comentarioFotoRef = useRef(null);
  const navRef = useRef(null);
  const btnFavoritarRef = useRef(null);

  const [ponto, setPonto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [avioes, setAvioes] = useState([]);

  const [denunciaModal, setDenunciaModal] = useState({ aberto: false, comentarioId: null });
  const [motivoDenuncia, setMotivoDenuncia] = useState('');
  const [novoComentario, setNovoComentario] = useState({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });

  useEffect(() => {
    // TODO: GET /pontos-turisticos/{id}, GET /fotos/ponto/{id}, GET /comentarios/ponto/{id}
    setTimeout(() => {
      const pontoEncontrado = PONTOS_POR_ID[Number(id)];
      const fotosEncontradas = FOTOS_MOCK[Number(id)] ?? FOTOS_MOCK[1];
      const comentariosEncontrados = COMENTARIOS_MOCK[Number(id)] ?? COMENTARIOS_MOCK[1];

      setPonto(pontoEncontrado ?? null);
      setFotos(fotosEncontradas);
      setComentarios(comentariosEncontrados);
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

  const handleFotoComentario = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNovoComentario((prev) => ({ ...prev, fotoPreview: preview, fotoFile: file }));
  };

  const removerFotoComentario = () => {
    setNovoComentario((prev) => ({ ...prev, fotoPreview: null, fotoFile: null }));
  };

  const enviarComentario = () => {
    if (!novoComentario.texto.trim()) return;
    const novo = {
      id: Date.now(),
      usuario: { nome: 'Você' },
      texto: novoComentario.texto,
      nota: novoComentario.nota,
      curtidas: 0,
      fotoUrl: novoComentario.fotoPreview,
    };
    setComentarios((prev) => [novo, ...prev]);
    setNovoComentario({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });
  };

  const abrirDenuncia = (comentarioId) => {
    setDenunciaModal({ aberto: true, comentarioId });
    setMotivoDenuncia('');
  };

  const enviarDenuncia = () => {
    if (!motivoDenuncia.trim()) return;
    setDenunciaModal({ aberto: false, comentarioId: null });
    setMotivoDenuncia('');
    alert('Denúncia enviada! Nossa equipe irá analisar.');
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
          <h2>Avaliações ({comentarios.length})</h2>
        </div>

        <div className="detalhe-comentarios">

          <div className="comentario-form">
            <h3>Deixe sua avaliação</h3>
            <div className="form-nota">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`nota-estrela ${n <= novoComentario.nota ? 'ativa' : ''}`}
                  onClick={() => setNovoComentario((prev) => ({ ...prev, nota: n }))}
                >
                  <Star size={22} fill={n <= novoComentario.nota ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <textarea
              className="form-textarea"
              placeholder="Conte sua experiência neste lugar..."
              value={novoComentario.texto}
              onChange={(e) => setNovoComentario((prev) => ({ ...prev, texto: e.target.value }))}
              rows={3}
            />
            {novoComentario.fotoPreview && (
              <div className="form-foto-preview">
                <img src={novoComentario.fotoPreview} alt="Preview" />
                <button className="btn-remover-foto" onClick={removerFotoComentario}>
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="form-rodape">
              <button className="btn-anexar-foto" onClick={() => comentarioFotoRef.current?.click()}>
                <ImagePlus size={16} />
                Anexar foto
              </button>
              <input
                ref={comentarioFotoRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFotoComentario}
              />
              <button className="btn-enviar-comentario" onClick={enviarComentario}>
                Publicar avaliação
              </button>
            </div>
          </div>

          <div className="comentarios-lista">
            {comentarios.length === 0 ? (
              <div className="aba-vazia">
                <MessageCircle size={32} />
                <p>Nenhuma avaliação ainda. Seja o primeiro!</p>
              </div>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="comentario-card">
                  <div className="comentario-header">
                    <div className="comentario-avatar">
                      {c.usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="comentario-header-info">
                      <span className="comentario-autor">{c.usuario.nome}</span>
                      <Estrelas nota={c.nota} tamanho={13} />
                    </div>
                  </div>
                  <p className="comentario-texto">{c.texto}</p>
                  {c.fotoUrl && (
                    <img className="comentario-foto" src={c.fotoUrl} alt="Foto do comentário" />
                  )}
                  <div className="comentario-footer">
                    <button className="btn-curtir">
                      <Heart size={13} /> {c.curtidas}
                    </button>
                    <button className="btn-denunciar" onClick={() => abrirDenuncia(c.id)}>
                      <Flag size={13} /> Denunciar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {denunciaModal.aberto && (
        <div className="modal-overlay" onClick={() => setDenunciaModal({ aberto: false, comentarioId: null })}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Denunciar comentário</h3>
              <button className="modal-fechar" onClick={() => setDenunciaModal({ aberto: false, comentarioId: null })}>
                <X size={18} />
              </button>
            </div>
            <p className="modal-descricao">Qual o motivo da denúncia?</p>
            <div className="modal-opcoes">
              {['Conteúdo ofensivo', 'Spam', 'Informação incorreta', 'Outro'].map((op) => (
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
              disabled={!motivoDenuncia}
            >
              Enviar denúncia
            </button>
          </div>
        </div>
      )}
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