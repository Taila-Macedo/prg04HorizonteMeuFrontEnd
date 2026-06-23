import React from 'react';
import { MapPin, Ticket, Heart } from 'lucide-react';
import './Card.css';

// URL da imagem gerada de Banff National Park
const BANFF_IMAGE_URL = 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&q=80';

export default function SpotCard({ item }) {
  // Dados simulados do ponto turístico
  const dados = item || {
    titulo: "Banff National Park",
    categoria: "Natureza & Montanha",
    descricao: "Explore as Montanhas Rochosas canadenses, com lagos azul-turquesa de tirar o fôlego, como o Lake Louise, e trilhas deslumbrantes.",
    preco: "Ticket do Parque: CAD $11",
    codigoLoc: "ALBERTA, CA",
    img: BANFF_IMAGE_URL
  };

  return (
    <div className="card">
      <img className="image" src={dados.img} alt={dados.titulo} />
      
      <div className="content">
        <h2>{dados.titulo}</h2>
        <h3>{dados.categoria}</h3>
        
        <p>{dados.descricao}</p>
        
        <a href="https://parks.canada.ca/pn-np/ab/banff" target="_blank" rel="noreferrer" className="read-more">Saiba mais</a>
        
        {/* Detalhes com Ícones */}
        <div className="details">
          <span className="item">
            <Ticket size={16} className="material-icon" />
            <em>{dados.preco}</em>
          </span>
          
          <span className="item">
            <MapPin size={16} className="material-icon" />
            <em>{dados.codigoLoc}</em>
          </span>
        </div>
        
        {/* Botões de Ação inferiores */}
        <div className="buttons">
          <button className="primary-btn">Ver no mapa</button>
          <button className="icon-btn" title="Adicionar aos Favoritos">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}