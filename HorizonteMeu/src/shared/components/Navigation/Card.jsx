import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import './Card.css';

export default function SpotCard({ item }) {
  const navigate = useNavigate();

  const dados = item || {
    id: 1,
    nome: 'Banff National Park',
    categoria: 'PARQUE',
    descricao: 'Explore as Montanhas Rochosas canadenses, com lagos azul-turquesa de tirar o fôlego.',
    cidade: 'Alberta',
    pais: 'Canadá',
    img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&q=80',
  };

  const irParaDetalhe = () => {
    if (dados.id) navigate(`/pontos/${dados.id}`);
  };

  return (
    <div className="card">
      <img className="image" src={dados.img || dados.url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500'} alt={dados.nome || dados.titulo} />

      <div className="content">
        <h2>{dados.nome || dados.titulo}</h2>
        <h3>{dados.categoria}</h3>

        <p>{dados.descricao}</p>

        <div className="details">
          <span className="item">
            <MapPin size={16} className="material-icon" />
            <em>{dados.cidade && dados.pais ? `${dados.cidade}, ${dados.pais}` : dados.codigoLoc}</em>
          </span>
        </div>

        <div className="buttons">
          <button className="primary-btn" onClick={irParaDetalhe}>Ver detalhes</button>
          <button className="icon-btn" title="Adicionar aos Favoritos">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}