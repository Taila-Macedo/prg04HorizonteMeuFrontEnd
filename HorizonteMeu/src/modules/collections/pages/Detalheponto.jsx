import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Camera, MessageCircle, Map, Route, Flag, X, ImagePlus } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import '../styles/DetalhePonto.css';

const PONTO_MOCK = {
  id: 1,
  nome: 'Torre Eiffel',
  descricao: 'Um dos monumentos mais famosos do mundo, a Torre Eiffel foi construída em 1889 como o arco de entrada para a Exposição Universal de Paris. Com seus 330 metros de altura, oferece uma vista deslumbrante de toda a cidade.',
  cidade: 'Paris',
  pais: 'França',
  latitude: 48.8584,
  longitude: 2.2945,
  notaMedia: 4.8,
  categoria: 'MONUMENTO',
};

const FOTOS_MOCK = [
  { id: 1, url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { id: 2, url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800' },
  { id: 3, url: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?w=800' },
];

const COMENTARIOS_MOCK = [
  { id: 1, usuario: { nome: 'Ana Lima' }, texto: 'Lugar incrível! A vista do topo é de tirar o fôlego.', nota: 5, curtidas: 12, fotoUrl: null },
  { id: 2, usuario: { nome: 'Carlos Souza' }, texto: 'Vale muito a pena visitar. Cheguei cedo para evitar filas e foi perfeito.', nota: 4, curtidas: 7, fotoUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400' },
  { id: 3, usuario: { nome: 'Mariana Costa' }, texto: 'Experiência única! O pôr do sol visto de lá é inesquecível.', nota: 5, curtidas: 20, fotoUrl: null },
];

const CATEGORIA_LABEL = {
  PRAIA: '🏖️ Praia',
  MUSEU: '🏛️ Museu',
  MONTANHA: '⛰️ Montanha',
  MONUMENTO: '🗿 Monumento',
  PARQUE: '🌳 Parque',
};

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
  const navRef = useRef(null);         // ref para o Navigation (pegar posição do coração)
  const btnFavoritarRef = useRef(null); // ref para o botão favoritar (ponto de partida)

  const [ponto, setPonto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Animação do avião
  const [avioes, setAvioes] = useState([]); // lista de aviões voando

  const [denunciaModal, setDenunciaModal] = useState({ aberto: false, comentarioId: null });
  const [motivoDenuncia, setMotivoDenuncia] = useState('');
  const [novoComentario, setNovoComentario] = useState({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });

  useEffect(() => {
    setTimeout(() => {
      setPonto(PONTO_MOCK);
      setFotos(FOTOS_MOCK);
      setComentarios(COMENTARIOS_MOCK);
      setCarregando(false);
    }, 400);
  }, [id]);

  const abrirGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${ponto.latitude},${ponto.longitude}`;
    window.open(url, '_blank');
  };

  const toggleFavorito = () => {
    if (favoritado) {
      // Só desfavorita, sem animação
      setFavoritado(false);
      return;
    }

    // Pega posições de origem (botão) e destino (coração no nav)
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

      // Remove o avião após a animação terminar (1.2s)
      setTimeout(() => {
        setAvioes((prev) => prev.filter((a) => a.id !== novoAviao.id));
        // Favorita e dispara pulso no coração do nav
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

      {/* Aviões voando — renderizados fora do fluxo, sobre tudo */}
      {avioes.map((aviao) => (
        <AviaoAnimado key={aviao.id} {...aviao} />
      ))}

      <Navigation ref={navRef} esconderBusca favoritado={favoritado} />

      {/* Hero */}
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
          {CATEGORIA_LABEL[ponto.categoria] || ponto.categoria}
        </span>
      </div>

      {/* Conteúdo principal */}
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

        {/* Botões de ação */}
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

      {/* Modal de denúncia */}
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

// ── Componente do avião animado ──
// Cria um elemento fixo na tela que voa em arco do botão até o coração
function AviaoAnimado({ x, y, destinoX, destinoY }) {
  const dx = destinoX - x;
  const dy = destinoY - y;
  const distancia = Math.sqrt(dx * dx + dy * dy);
  const angulo = Math.atan2(dy, dx) * (180 / Math.PI);

  // CSS custom properties para a animação
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