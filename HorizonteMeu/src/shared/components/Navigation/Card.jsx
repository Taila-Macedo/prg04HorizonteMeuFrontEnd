import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Star, Landmark } from 'lucide-react';
import { useFavoritos } from '../../../modules/favorites/hooks/useFavoritos';
import './Card.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function SpotCard({ item }) {
  const navigate = useNavigate();
  const { isFavoritado, favoritar, removerFavorito, getFavoritoId } = useFavoritos();

  const dados = item || {
    id: 1,
    nome: 'Banff National Park',
    categoria: 'PARQUE',
    descricao: 'Explore as Montanhas Rochosas canadenses, com lagos azul-turquesa de tirar o fôlego.',
    cidade: 'Alberta',
    pais: 'Canadá',
    img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&q=80',
  };

  const [fotoUrl, setFotoUrl] = useState(dados.img || null);

  // Busca a primeira foto do ponto no endpoint de fotos
  useEffect(() => {
    if (!dados.id || dados.img) return; // já tem imagem padrão (mock), não busca

    let cancelado = false;

    const carregarFoto = async () => {
      try {
        const res = await fetch(`${BASE}/fotos/ponto/${dados.id}`);
        if (!res.ok) return;
        const lista = await res.json();
        if (!cancelado && Array.isArray(lista) && lista.length > 0) {
          setFotoUrl(lista[0].url);
        }
      } catch {
        // silenciosamente ignora, mantém placeholder
      }
    };

    carregarFoto();
    return () => { cancelado = true; };
  }, [dados.id, dados.img]);

  const irParaDetalhe = () => {
    if (dados.id) navigate(`/pontos/${dados.id}`);
  };

  const favoritado = isFavoritado(dados.id);

  const handleFavorito = async (e) => {
    e.stopPropagation();
    if (favoritado) {
      const favId = getFavoritoId(dados.id);
      if (favId) await removerFavorito(favId);
    } else {
      await favoritar(dados.id);
    }
  };

  return (
    <div className="card" onClick={irParaDetalhe}>
      <div className="image-container">
        {fotoUrl ? (
          <img className="image" src={fotoUrl} alt={dados.nome} />
        ) : (
          <div className="image image-placeholder">
            <Landmark size={28} />
          </div>
        )}
        <div className="tag-monumento">
          <Landmark size={12} />
          {dados.categoria}
        </div>
      </div>

      <div className="content">
        <h2>{dados.nome || dados.titulo}</h2>

        <div className="details">
          <span className="item">
            <MapPin size={12} className="material-icon" />
            <em>{dados.cidade}, {dados.pais}</em>
          </span>
        </div>

        <p className="card-descricao-curta">{dados.descricao}</p>

        <div className="card-footer">
          <div className="rating">
            <Star size={14} fill="#ffb703" stroke="#ffb703" />
            <span>{dados.notaMedia?.toFixed(1) || dados.nota || '0.0'}</span>
          </div>

          <div className="buttons-group">
            <button className="primary-btn-details" onClick={irParaDetalhe}>
              Ver detalhes
            </button>
            <button 
              className={`icon-btn-favorite ${favoritado ? 'active' : ''}`} 
              onClick={handleFavorito}
              title={favoritado ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
              <Heart size={18} fill={favoritado ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}