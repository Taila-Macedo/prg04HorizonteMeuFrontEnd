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
      nome: "Torre Eiffel",
      categoria: "Monumento", 
      descricao: "O ícone global da França.", 
      cidade: "Paris",
      pais: "França",
      nota: "4.8",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500" 
    },
    { 
      id: 2, 
      nome: "Museu do Louvre",
      categoria: "Museu", 
      descricao: "O maior museu de arte do mundo.", 
      cidade: "Paris",
      pais: "França",
      nota: "4.8",
      img: "https://images.unsplash.com/photo-1597923891164-46c29d6c28c3?w=500" 
    },
    {
      id: 3,
      nome: "Praia de Nice",
      categoria: "Praia",
      descricao: "Famosa praia da Riviera Francesa.",
      cidade: "Nice",
      pais: "França",
      nota: "4.5",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500"
    },
    {
      id: 4,
      nome: "Mont Blanc",
      categoria: "Montanha",
      descricao: "O pico mais alto dos Alpes.",
      cidade: "Chamonix",
      pais: "França",
      nota: "4.9",
      img: "https://images.unsplash.com/photo-1531400158697-004a55d99396?w=500"
    },
    {
      id: 5,
      nome: "Jardim de Versalhes",
      categoria: "Parque",
      descricao: "Os famosos jardins do Palácio de Versalhes.",
      cidade: "Versalhes",
      pais: "França",
      nota: "4.7",
      img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500"
    }
  ]
};

// Mapa de categoria do mock → chave do filtro
const CATEGORIA_PARA_FILTRO = {
  "Monumento": "monumentos",
  "Museu":     "museus",
  "Praia":     "praias",
  "Montanha":  "montanhas",
  "Parque":    "parques",
};

// Coordenadas por id para os marcadores no mapa
const COORDENADAS_FRANCE = {
  1: [2.2945, 48.8584],
  2: [2.3376, 48.8606],
  3: [7.2661, 43.7102],
  4: [6.8652, 45.8326],
  5: [2.1204, 48.8049],
};

export default function Dashboard() {
  const [pontosNoMapa, setPontosNoMapa] = useState([
    { id: 1, nome: "Torre Eiffel", coordinates: [2.2945, 48.8584], paisKey: "france" }
  ]);

  const [paisPesquisado, setPaisPesquisado] = useState("");
  const [painelAberto, setPainelAberto] = useState(false);

  // Todos os cards do país pesquisado (sem filtro)
  const [todosCards, setTodosCards] = useState([]);

  // CORRIGIDO: chaves alinhadas com os botões do JSX (praias, montanhas, museus, monumentos, parques)
  const [filtros, setFiltros] = useState({
    praias:     true,
    montanhas:  true,
    museus:     true,
    monumentos: true,
    parques:    true,
  });

  const alternarFiltro = (chave) => {
    setFiltros(prev => ({ ...prev, [chave]: !prev[chave] }));
  };

  // CORRIGIDO: filtra os cards com base nos filtros ativos
  const cardsExibir = todosCards.filter(card => {
    const chave = CATEGORIA_PARA_FILTRO[card.categoria];
    if (!chave) return true; // categoria desconhecida → exibe sempre
    return filtros[chave];
  });

  const lidarComPesquisa = (termo) => {
    // Normaliza acentos para a busca funcionar com "França" e "franca"
    const normalizar = (str) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    const termoNorm = normalizar(termo);
    const chaveEncontrada = Object.keys(BASE_DADOS_MOCK).find(
      chave => normalizar(chave) === termoNorm || 
               (chave === 'france' && (termoNorm === 'franca' || termoNorm === 'france' || termoNorm === 'franca'))
    );

    if (chaveEncontrada) {
      const dados = BASE_DADOS_MOCK[chaveEncontrada];
      const nomeExibir = chaveEncontrada === "france" ? "França" : chaveEncontrada;

      setPaisPesquisado(nomeExibir);
      setTodosCards(dados);
      setPainelAberto(true);

      // CORRIGIDO: era item.titulo, agora usa item.nome
      const novosMarcadores = dados.map(item => ({
        id: item.id,
        nome: item.nome,
        coordinates: COORDENADAS_FRANCE[item.id] ?? [2.2945, 48.8584],
        paisKey: chaveEncontrada
      }));
      setPontosNoMapa(novosMarcadores);
    } else {
      alert("Tente pesquisar por 'França'");
    }
  };

  const lidarComCliqueNoPino = (pontoClicado) => {
    if (pontoClicado.paisKey && BASE_DADOS_MOCK[pontoClicado.paisKey]) {
      const nomeExibir = pontoClicado.paisKey === "france" ? "França" : pontoClicado.paisKey;
      setPaisPesquisado(nomeExibir);
      setTodosCards(BASE_DADOS_MOCK[pontoClicado.paisKey]);
      setPainelAberto(true);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation aoPesquisar={lidarComPesquisa} />
      
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
            {cardsExibir.length > 0 ? (
              cardsExibir.map((card) => (
                <SpotCard key={card.id} item={card} />
              ))
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                Nenhum ponto corresponde aos filtros ativos.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}