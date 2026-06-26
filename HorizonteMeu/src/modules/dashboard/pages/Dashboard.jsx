import React, { useState } from "react";
import { Navigation } from "../../../shared/components/Navigation/Navigation";
import { Mapa3D } from "../../maps/pages/Mapa3D";
import SpotCard from "../../../shared/components/Navigation/Card";
import { PONTOS_MOCK, CATEGORIA_PARA_FILTRO } from '../../../shared/mocks/mockData';

import '../styles/Dashboard.css';
import '../../../shared/components/Navigation/Card.css';
import '../../../shared/components/Navigation/PainelLateral.css';

export default function Dashboard() {
  const [pontosNoMapa, setPontosNoMapa] = useState([
    { id: 1, nome: "Torre Eiffel", coordinates: [2.2945, 48.8584], paisKey: "france" }
  ]);

  const [paisPesquisado, setPaisPesquisado] = useState("");
  const [painelAberto, setPainelAberto] = useState(false);
  const [todosCards, setTodosCards] = useState([]);

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

  const cardsExibir = todosCards.filter(card => {
    const chave = CATEGORIA_PARA_FILTRO[card.categoria];
    if (!chave) return true;
    return filtros[chave];
  });

  const lidarComPesquisa = (termo) => {
    const normalizar = (str) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    const termoNorm = normalizar(termo);
    const chaveEncontrada = Object.keys(PONTOS_MOCK).find(
      chave => normalizar(chave) === termoNorm ||
               (chave === 'france' && (termoNorm === 'franca' || termoNorm === 'france'))
    );

    if (chaveEncontrada) {
      const dados = PONTOS_MOCK[chaveEncontrada];
      const nomeExibir = chaveEncontrada === "france" ? "França" : chaveEncontrada;

      setPaisPesquisado(nomeExibir);
      setTodosCards(dados);
      setPainelAberto(true);

      const novosMarcadores = dados.map(item => ({
        id: item.id,
        nome: item.nome,
        coordinates: [item.longitude, item.latitude],
        paisKey: chaveEncontrada
      }));
      setPontosNoMapa(novosMarcadores);
    } else {
      alert("Tente pesquisar por 'França'");
    }
  };

  const lidarComCliqueNoPino = (pontoClicado) => {
    if (pontoClicado.paisKey && PONTOS_MOCK[pontoClicado.paisKey]) {
      const nomeExibir = pontoClicado.paisKey === "france" ? "França" : pontoClicado.paisKey;
      setPaisPesquisado(nomeExibir);
      setTodosCards(PONTOS_MOCK[pontoClicado.paisKey]);
      setPainelAberto(true);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation aoPesquisar={lidarComPesquisa} />

      <div className="dashboard-main-content">

        <aside className="painel-filtros-esquerdo">
          <div className="filtros-lista">
            <button className={`filtro-btn ${filtros.praias ? 'ativo' : ''}`} onClick={() => alternarFiltro('praias')}>
              <span>🏖️</span> Praias
            </button>
            <button className={`filtro-btn ${filtros.montanhas ? 'ativo' : ''}`} onClick={() => alternarFiltro('montanhas')}>
              <span>⛰️</span> Montanhas
            </button>
            <button className={`filtro-btn ${filtros.museus ? 'ativo' : ''}`} onClick={() => alternarFiltro('museus')}>
              <span>🏛️</span> Museus
            </button>
            <button className={`filtro-btn ${filtros.monumentos ? 'ativo' : ''}`} onClick={() => alternarFiltro('monumentos')}>
              <span>🗿</span> Monumentos
            </button>
            <button className={`filtro-btn ${filtros.parques ? 'ativo' : ''}`} onClick={() => alternarFiltro('parques')}>
              <span>🌳</span> Parques
            </button>
          </div>
        </aside>

        <div className="map-placeholder">
          <Mapa3D
            pontosTuristicos={pontosNoMapa}
            aoSelecionarPonto={lidarComCliqueNoPino}
            paisFoco={paisPesquisado}
          />
        </div>

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