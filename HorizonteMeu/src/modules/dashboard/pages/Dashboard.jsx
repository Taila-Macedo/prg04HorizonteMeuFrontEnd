import React, { useState } from "react";
import { Navigation } from "../../../shared/components/Navigation/Navigation";
import { Mapa3D } from "../../maps/pages/Mapa3D"; 
import SpotCard from "../../../shared/components/Navigation/Card"; 

import '../styles/Dashboard.css';
import '../../../shared/components/Navigation/Card.css';
import '../../../shared/components/Navigation/PainelLateral.css';

const BASE_DADOS_MOCK = {
  france: [
    { 
      id: 1, 
      nome: "Torre Eiffel",       // Alterado de 'titulo' para 'nome'
      categoria: "Monumento", 
      descricao: "O ícone global da França.", 
      cidade: "Paris",            // Dividido do 'codigoLoc' para 'cidade'
      pais: "França",             // Dividido do 'codigoLoc' para 'pais'
      nota: "4.8",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500" 
    },
    { 
      id: 2, 
      nome: "Museu do Louvre",    // Alterado de 'titulo' para 'nome'
      categoria: "Cultura", 
      descricao: "O maior museum de arte do mundo.", 
      cidade: "Paris",            // Dividido do 'codigoLoc' para 'cidade'
      pais: "França",             // Dividido do 'codigoLoc' para 'pais'
      nota: "4.8",
      img: "https://images.unsplash.com/photo-1597923891164-46c29d6c28c3?w=500" 
    }
  ]
};

export default function Dashboard() {
  const [pontosNoMapa, setPontosNoMapa] = useState([
    { id: 1, nome: "Torre Eiffel", coordinates: [2.2945, 48.8584], paisKey: "france" }
  ]);

  const [paisPesquisado, setPaisPesquisado] = useState("");
  const [painelAberto, setPainelAberto] = useState(false);
  const [cardsExibir, setCardsExibir] = useState([]);

  // NOVO: Estado para gerenciar as chaves dos filtros da esquerda
  const [filtros, setFiltros] = useState({
    historia: true,
    natureza: true,
    parques: true,
    patrimonios: false
  });

  const alternarFiltro = (chave) => {
    setFiltros(prev => ({ ...prev, [chave]: !prev[chave] }));
  };

  const lidarComPesquisa = (termo) => {
    let termoFormatado = termo.toLowerCase().trim();
    if (termoFormatado === "franca") termoFormatado = "france";

    if (BASE_DADOS_MOCK[termoFormatado]) {
      const nomeExibir = termoFormatado === "france" ? "França" : "Canadá";
      setPaisPesquisado(nomeExibir);
      setCardsExibir(BASE_DADOS_MOCK[termoFormatado]);
      setPainelAberto(true);

      const novosMarcadores = BASE_DADOS_MOCK[termoFormatado].map(item => ({
        id: item.id,
        nome: item.titulo,
        coordinates: termoFormatado === 'france' 
          ? (item.id === 1 ? [2.2945, 48.8584] : [2.3376, 48.8606]) 
          : [-115.5708, 51.1784],
        paisKey: termoFormatado
      }));
      setPontosNoMapa(novosMarcadores);
    } else {
      alert("Tente pesquisar por 'França' (sem acento)");
    }
  };

  const lidarComCliqueNoPino = (pontoClicado) => {
    if (pontoClicado.paisKey && BASE_DADOS_MOCK[pontoClicado.paisKey]) {
      const nomeExibir = pontoClicado.paisKey === "france" ? "França" : "Canadá";
      setPaisPesquisado(nomeExibir);
      setCardsExibir(BASE_DADOS_MOCK[pontoClicado.paisKey]);
      setPainelAberto(true);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation aoPesquisar={lidarComPesquisa} />
      
      {/* Área de conteúdo que segura os elementos abaixo da navegação */}
      <div className="dashboard-main-content">
        
        {/* PAINEL LATERAL ESQUERDO: Filtros */}
        <aside className="painel-filtros-esquerdo">
          <div className="filtros-lista">
            
            <button 
              className={`filtro-btn ${filtros.praias ? 'ativo' : ''}`}
              onClick={() => alternarFiltro('praias')}
            >
              <span>🏖️</span> Praias
            </button>

            <button 
              className={`filtro-btn ${filtros.montanhas ? 'ativo' : ''}`}
              onClick={() => alternarFiltro('montanhas')}
            >
              <span>⛰️</span> Montanhas
            </button>

            <button 
              className={`filtro-btn ${filtros.museus ? 'ativo' : ''}`}
              onClick={() => alternarFiltro('museus')}
            >
              <span>🏛️</span> Museus
            </button>

            <button 
              className={`filtro-btn ${filtros.monumentos ? 'ativo' : ''}`}
              onClick={() => alternarFiltro('monumentos')}
            >
              <span>🗿</span> Monumentos
            </button>

            <button 
              className={`filtro-btn ${filtros.parques ? 'ativo' : ''}`}
              onClick={() => alternarFiltro('parques')}
            >
              <span>🌳</span> Parques
            </button>

          </div>
        </aside>

        {/* CENTRO: Mapa */}
        <div className="map-placeholder">
          <Mapa3D 
            pontosTuristicos={pontosNoMapa} 
            aoSelecionarPonto={lidarComCliqueNoPino} 
            paisFoco={paisPesquisado} 
          />
        </div>

        {/* PAINEL LATERAL DIREITO: Cards */}
        <div className={`painel-lateral-cards ${painelAberto ? "" : "escondido"}`}>
          <div className="painel-header">
            <h2>{paisPesquisado}</h2>
            <button className="btn-fechar-painel" onClick={() => setPainelAberto(false)}>✕</button>
          </div>
          
          <div className="lista-de-cards-scroll space-y-6">
            {cardsExibir.map((card) => (
              <SpotCard key={card.id} item={card} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}