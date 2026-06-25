import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, Star, Landmark } from 'lucide-react';
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
      <div className="image-container">
        <img className="image" src={dados.img} alt={dados.nome} />
        <div className="tag-monumento">
          <Landmark size={12} />
          {dados.categoria}
        </div>
      </div>

      <div className="content">
        {/* Adicionado apenas o h2 aqui para renderizar o nome do ponto */}
        <h2>{dados.nome || dados.titulo}</h2>

        <div className="details">
          <span className="item">
            <MapPin size={12} className="material-icon" />
            <em>{dados.cidade}, {dados.pais}</em>
          </span>
        </div>

        <p>{dados.descricao}</p>

        <div className="card-footer">
          <div className="rating">
            <Star size={14} fill="#ffb703" stroke="#ffb703" />
            <span>{dados.nota || '4.8'}</span>
          </div>

          <div className="buttons-group">
            <button className="primary-btn-details" onClick={irParaDetalhe}>
              Ver detalhes
            </button>
            <button className="icon-btn-favorite" title="Adicionar aos Favoritos">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}