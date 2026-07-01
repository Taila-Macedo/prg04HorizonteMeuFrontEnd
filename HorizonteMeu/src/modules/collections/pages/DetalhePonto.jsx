import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Camera, MessageCircle, Map, Route, X, ImagePlus, Check, Edit2 } from 'lucide-react';
import { Navigation } from '../../../shared/components/Navigation/Navigation';
import { ComentariosSecao } from '../../comments/components/ComentariosSecao';
import { useUploadFoto } from '../../../shared/hooks/useUploadFoto';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useFavoritos } from '../../../shared/contexts/FavoritosContext';
import '../styles/DetalhePonto.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

function AviaoAnimado({ x, y, destinoX, destinoY }) {
  return (
    <div
      className="aviao-container"
      style={{
        '--start-x': `${x}px`,
        '--start-y': `${y}px`,
        '--end-x': `${destinoX}px`,
        '--end-y': `${destinoY}px`,
      }}
    >
      <span className="aviao-icone" role="img" aria-label="avião">✈️</span>
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
  const { isFavoritado, favoritar, removerFavorito, getFavoritoId } = useFavoritos();

  const [ponto, setPonto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [avioes, setAvioes] = useState([]);
  const [erroCarregamento, setErroCarregamento] = useState('');

  const fotoInputRef = useRef(null);
  const [modalFoto, setModalFoto] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [legenda, setLegenda] = useState('');
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [fotoEnviada, setFotoEnviada] = useState(false);

  const [modalRoteiro, setModalRoteiro] = useState(false);

  const isAdmin = usuario?.perfil === 'ADMINISTRADOR';
  const favoritado = isFavoritado(id);

  useEffect(() => {
    const carregarPonto = async () => {
      try {
        setCarregando(true);
        const res = await fetch(`${BASE}/pontos/${id}`);
        if (!res.ok) throw new Error('Ponto turístico não encontrado.');
        const data = await res.json();
        setPonto(data);

        const resFotos = await fetch(`${BASE}/fotos/ponto/${id}`);
        if (resFotos.ok) {
          const fotosList = await resFotos.json();
          setFotos(Array.isArray(fotosList) ? fotosList : []);
        }
      } catch (err) {
        setErroCarregamento(err.message);
      } finally {
        setCarregando(false);
      }
    };
    carregarPonto();
  }, [id]);

  const toggleFavorito = async () => {
    if (favoritado) {
      const favId = getFavoritoId(id);
      if (favId) await removerFavorito(favId);
    } else {
      const origem = btnFavoritarRef.current?.getBoundingClientRect();
      const destino = navRef.current?.getPosicaoCoracao?.();

      if (origem && destino) {
        const novoAviao = {
          id: Date.now(),
          x: origem.left + origem.width / 2,
          y: origem.top + origem.height / 2,
          destinoX: destino.left + destino.width / 2,
          destinoY: destino.top + destino.height / 2,
        };
        setAvioes((prev) => [...prev, novoAviao]);

        await favoritar(id);

        setTimeout(() => {
          navRef.current?.pulsarCoracao?.();
        }, 100); // pulsa quando o avião está chegando

        setTimeout(() => {
          setAvioes((prev) => prev.filter((a) => a.id !== novoAviao.id));
        }, 1100); // remove o avião depois
      } else {
        await favoritar(id);
      }
    }
  };

  const handleEnviarFoto = async () => {
    if (!fotoSelecionada) return;
    setEnviandoFoto(true);
    const resultado = await uploadFoto({
      arquivo: fotoSelecionada,
      idUsuario: usuario?.id,
      idPontoTuristico: Number(id),
      legenda: legenda.trim(),
    });
    setEnviandoFoto(false);
    if (resultado) {
      setFotoEnviada(true);
      setTimeout(() => setModalFoto(false), 1500);
    }
  };

  if (carregando) return <div className="detalhe-loading"><div className="loading-spinner" /><p>Carregando...</p></div>;
  if (!ponto) return <div className="detalhe-loading"><p>{erroCarregamento || 'Ponto não encontrado.'}</p><button onClick={() => navigate('/pontos')}>Voltar</button></div>;

  return (
    <div className="detalhe-container">
      {avioes.map((aviao) => <AviaoAnimado key={aviao.id} {...aviao} />)}
      <Navigation ref={navRef} esconderBusca />

      <div className="detalhe-hero">
        {fotos.length > 0 ? (
          <>
            <img className="detalhe-hero-img" src={fotos[fotoAtiva]?.url} alt={ponto.nome} />
            {fotos.length > 1 && (
              <div className="detalhe-thumbnails">
                {fotos.map((foto, i) => (
                  <button key={foto.id} className={`thumbnail-btn ${i === fotoAtiva ? 'ativa' : ''}`} onClick={() => setFotoAtiva(i)}>
                    <img src={foto.url} alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="detalhe-hero-vazio"><Camera size={40} /><span>Sem fotos</span></div>
        )}
        <span className="detalhe-categoria-badge">{CATEGORIA_LABEL[ponto.categoria] || ponto.categoria}</span>
      </div>

      <div className="detalhe-main">
        <div className="detalhe-cabecalho">
          <div className="detalhe-cabecalho-info">
            <h1 className="detalhe-nome">{ponto.nome}</h1>
            <div className="detalhe-localizacao"><MapPin size={15} /><span>{ponto.cidade}, {ponto.pais}</span></div>
          </div>
          <div className="detalhe-nota">
            <Estrelas nota={ponto.notaMedia} tamanho={18} />
            <span className="nota-valor">{ponto.notaMedia?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <div className="detalhe-acoes">
          <button ref={btnFavoritarRef} className={`btn-acao ${favoritado ? 'ativo-vermelho' : ''}`} onClick={toggleFavorito}>
            <Heart size={17} fill={favoritado ? 'currentColor' : 'none'} />
            {favoritado ? 'Salvo' : 'Favoritar'}
          </button>
          <button className="btn-acao ativo-azul" onClick={() => window.open(`https://www.google.com/maps?q=${ponto.latitude},${ponto.longitude}`, '_blank')}>
            <Map size={17} />Ver no mapa
          </button>
          <button className="btn-acao" onClick={() => setModalFoto(true)}><Camera size={17} />Enviar foto</button>
          <button className="btn-acao" onClick={() => setModalRoteiro(true)}><Route size={17} />Add. ao roteiro</button>
          {isAdmin && <button className="btn-acao ativo-amarelo" onClick={() => navigate(`/pontos/${id}/editar`)}><Edit2 size={17} />Editar</button>}
        </div>

        <p className="detalhe-descricao">{ponto.descricao}</p>

        <div className="detalhe-secao-titulo"><MessageCircle size={18} /><h2>Avaliações</h2></div>
        <div className="detalhe-comentarios"><ComentariosSecao pontoId={id} /></div>
      </div>

      {/* Modais omitidos para brevidade, mas mantidos no arquivo final */}
      {modalFoto && (
        <div className="modal-overlay" onClick={() => setModalFoto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Enviar foto</h3><button className="modal-fechar" onClick={() => setModalFoto(false)}><X size={18} /></button></div>
            {fotoEnviada ? (
              <div className="modal-sucesso"><div className="modal-sucesso-icon"><Check size={28} /></div><p>Foto enviada!</p></div>
            ) : (
              <>
                <div className={`modal-dropzone ${fotoPreview ? 'com-preview' : ''}`} onClick={() => fotoInputRef.current?.click()}>
                  {fotoPreview ? <img src={fotoPreview} alt="Preview" className="modal-foto-preview" /> : <><ImagePlus size={32} /><span>Selecionar foto</span></>}
                </div>
                <input ref={fotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files[0]; if(f){ setFotoSelecionada(f); setFotoPreview(URL.createObjectURL(f)); }}} />
                {fotoPreview && <div className="modal-legenda-container"><label className="modal-label">Legenda</label><input className="modal-input" type="text" value={legenda} onChange={(e) => setLegenda(e.target.value)} maxLength={100} /></div>}
                <button className="btn-enviar-modal" onClick={handleEnviarFoto} disabled={!fotoSelecionada || enviandoFoto}>{enviandoFoto ? 'Enviando...' : 'Enviar foto'}</button>
              </>
            )}
          </div>
        </div>
      )}
      {modalRoteiro && (
        <div className="modal-overlay" onClick={() => setModalRoteiro(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>Adicionar ao roteiro</h3><button className="modal-fechar" onClick={() => setModalRoteiro(false)}><X size={18} /></button></div>
            <p className="modal-descricao">Em breve!</p>
            <button className="btn-enviar-modal" onClick={() => setModalRoteiro(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}