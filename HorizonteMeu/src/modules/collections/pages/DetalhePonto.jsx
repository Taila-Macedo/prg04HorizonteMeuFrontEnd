import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Camera, MessageCircle, Map, Route, X, ImagePlus, Check, BookOpen } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { PONTOS_MOCK, FOTOS_MOCK, CATEGORIA_LABEL } from '../../../shared/mocks/mockData';
import { ComentariosSecao } from '../../comments/components/ComentariosSecao';
import { useUploadFoto } from '../../../shared/hooks/useUploadFoto';
import { useAuth } from '../../../shared/contexts/AuthContext';
import '../styles/DetalhePonto.css';

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
  const { usuario } = useAuth();
  const { uploadFoto } = useUploadFoto();

  const [ponto, setPonto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [avioes, setAvioes] = useState([]);

  const fotoInputRef = useRef(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [fotoEnviada, setFotoEnviada] = useState(false);

  const [modalRoteiro, setModalRoteiro] = useState(false);
  const [roteiros, setRoteiros] = useState([]);
  const [roteiroSelecionado, setRoteiroSelecionado] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
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

  const abrirModalFoto = () => {
    setFotoSelecionada(null);
    setFotoPreview(null);
    setFotoEnviada(false);
    setModalFoto(true);
  };

  const handleSelecionarFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoSelecionada(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleEnviarFoto = async () => {
    if (!fotoSelecionada) return;
    setEnviandoFoto(true);

    const resultado = await uploadFoto({
      arquivo: fotoSelecionada,
      idUsuario: usuario?.id,
      idPontoTuristico: Number(id),
    });

    setEnviandoFoto(false);

    if (resultado) {
      setFotoEnviada(true);
      setTimeout(() => setModalFoto(false), 1500);
    }
  };

  const fecharModalFoto = () => {
    setModalFoto(false);
    setFotoSelecionada(null);
    setFotoPreview(null);
    setFotoEnviada(false);
  };

  const abrirModalRoteiro = () => {
    setRoteiroSelecionado(null);
    setAdicionado(false);
    setModalRoteiro(true);
    setRoteiros([
      { id: 1, titulo: 'Férias de verão na Europa', quantidadePontos: 8 },
      { id: 2, titulo: 'Explorando o Nordeste', quantidadePontos: 5 },
    ]);
  };

  const handleAdicionarAoRoteiro = () => {
    if (!roteiroSelecionado) return;
    setAdicionando(true);
    setTimeout(() => {
      setAdicionando(false);
      setAdicionado(true);
      setTimeout(() => setModalRoteiro(false), 1500);
    }, 800);
  };

  const toggleFavorito = () => {
    if (favoritado) { setFavoritado(false); return; }

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

          <button className="btn-acao" onClick={abrirModalFoto} title="Enviar uma foto deste lugar">
            <Camera size={17} />
            Enviar foto
          </button>

          <button className="btn-acao" onClick={abrirModalRoteiro} title="Adicionar a um roteiro">
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

      {/* ── Modal enviar foto ── */}
      {modalFoto && (
        <div className="modal-overlay" onClick={fecharModalFoto}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enviar foto</h3>
              <button className="modal-fechar" onClick={fecharModalFoto}><X size={18} /></button>
            </div>

            {fotoEnviada ? (
              <div className="modal-sucesso">
                <div className="modal-sucesso-icon"><Check size={28} /></div>
                <p>Foto enviada com sucesso!<br />
                  <span>Ela ficará disponível após revisão da equipe.</span>
                </p>
              </div>
            ) : (
              <>
                <p className="modal-descricao">
                  Compartilhe sua foto de <strong>{ponto.nome}</strong> com a comunidade.
                </p>

                <div
                  className={`modal-dropzone ${fotoPreview ? 'com-preview' : ''}`}
                  onClick={() => fotoInputRef.current?.click()}
                >
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="modal-foto-preview" />
                  ) : (
                    <>
                      <ImagePlus size={32} />
                      <span>Clique para selecionar uma foto</span>
                      <small>JPG, PNG ou WEBP · máx. 10MB</small>
                    </>
                  )}
                </div>

                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleSelecionarFoto}
                />

                {fotoPreview && (
                  <button className="modal-trocar-foto" onClick={() => fotoInputRef.current?.click()}>
                    Trocar foto
                  </button>
                )}

                <button
                  className="btn-enviar-modal"
                  onClick={handleEnviarFoto}
                  disabled={!fotoSelecionada || enviandoFoto}
                >
                  {enviandoFoto ? 'Enviando...' : 'Enviar foto'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Modal adicionar ao roteiro ── */}
      {modalRoteiro && (
        <div className="modal-overlay" onClick={() => setModalRoteiro(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar ao roteiro</h3>
              <button className="modal-fechar" onClick={() => setModalRoteiro(false)}><X size={18} /></button>
            </div>

            {adicionado ? (
              <div className="modal-sucesso">
                <div className="modal-sucesso-icon"><Check size={28} /></div>
                <p>Ponto adicionado ao roteiro!</p>
              </div>
            ) : (
              <>
                <p className="modal-descricao">
                  Escolha em qual roteiro deseja adicionar <strong>{ponto.nome}</strong>:
                </p>

                {roteiros.length === 0 ? (
                  <div className="modal-sem-roteiros">
                    <BookOpen size={28} />
                    <p>Você ainda não tem roteiros.</p>
                    <button
                      className="btn-enviar-modal"
                      onClick={() => { setModalRoteiro(false); navigate('/roteiros/novo'); }}
                    >
                      Criar um roteiro
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="modal-roteiros-lista">
                      {roteiros.map((r) => (
                        <button
                          key={r.id}
                          className={`modal-roteiro-item ${roteiroSelecionado === r.id ? 'selecionado' : ''}`}
                          onClick={() => setRoteiroSelecionado(r.id)}
                        >
                          <div className="modal-roteiro-info">
                            <span className="modal-roteiro-titulo">{r.titulo}</span>
                            <span className="modal-roteiro-pontos">{r.quantidadePontos} pontos</span>
                          </div>
                          {roteiroSelecionado === r.id && <Check size={16} className="modal-roteiro-check" />}
                        </button>
                      ))}
                    </div>

                    <button
                      className="btn-enviar-modal"
                      onClick={handleAdicionarAoRoteiro}
                      disabled={!roteiroSelecionado || adicionando}
                    >
                      {adicionando ? 'Adicionando...' : 'Confirmar'}
                    </button>
                  </>
                )}
              </>
            )}
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