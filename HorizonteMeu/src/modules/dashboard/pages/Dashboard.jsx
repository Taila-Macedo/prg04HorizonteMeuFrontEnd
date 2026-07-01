import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../../../shared/components/Navigation/Navigation";
import { Mapa3D } from "../../maps/pages/Mapa3D";
import SpotCard from "../../../shared/components/Navigation/Card";

import '../styles/Dashboard.css';
import '../../../shared/components/Navigation/Card.css';
import '../../../shared/components/Navigation/PainelLateral.css';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const normalizar = (str = '') =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export default function Dashboard() {
  const navigate = useNavigate();

  const [pontos, setPontos] = useState([]);   // só os pontos com noMapa3D = true
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [painelAberto, setPainelAberto] = useState(false);

  // Busca os pontos da API e mantém apenas os marcados para o mapa 3D
  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        setErro('');
        const token = localStorage.getItem('hm_token');
        const res = await fetch(`${BASE}/pontos?page=0&size=100`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error('Erro ao carregar pontos turísticos.');

        const data = await res.json();
        const lista = Array.isArray(data.content) ? data.content : [];
        setPontos(lista.filter((p) => p.noMapa3D === true));
      } catch (err) {
        setErro(err.message || 'Erro ao carregar pontos.');
        setPontos([]);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  // Aplica apenas a busca por nome/cidade/país
  const pontosFiltrados = useMemo(() => {
    if (!busca.trim()) return pontos;
    const termo = normalizar(busca);
    return pontos.filter((p) =>
      normalizar(`${p.nome} ${p.cidade} ${p.pais}`).includes(termo)
    );
  }, [pontos, busca]);

  // Coordenadas do primeiro resultado da busca, para dar zoom no mapa
  const focoCoordenadas = useMemo(() => {
    if (!busca.trim() || pontosFiltrados.length === 0) return null;
    const alvo = pontosFiltrados[0];
    return [Number(alvo.longitude), Number(alvo.latitude)];
  }, [busca, pontosFiltrados]);

  // Marcadores do mapa: [longitude, latitude]
  const pontosNoMapa = useMemo(
    () =>
      pontosFiltrados.map((p) => ({
        id: p.id,
        nome: p.nome,
        coordinates: [Number(p.longitude), Number(p.latitude)],
      })),
    [pontosFiltrados]
  );

  const lidarComPesquisa = (termo) => {
    setBusca(termo);
    setPainelAberto(true);
  };

  // Clique no pino/nome do ponto -> vai para o detalhe
  const lidarComCliqueNoPino = (ponto) => {
    if (ponto?.id) navigate(`/pontos/${ponto.id}`);
  };

  return (
    <div className="dashboard-container">
      <Navigation aoPesquisar={lidarComPesquisa} />

      <div className="dashboard-main-content">
        <div className="map-placeholder">
          <Mapa3D
            pontosTuristicos={pontosNoMapa}
            aoSelecionarPonto={lidarComCliqueNoPino}
            focoCoordenadas={focoCoordenadas}
          />
        </div>

        <div className={`painel-lateral-cards ${painelAberto ? "" : "escondido"}`}>
          <div className="painel-header">
            <h2>Pontos no mapa</h2>
            <button className="btn-fechar-painel" onClick={() => setPainelAberto(false)}>✕</button>
          </div>
          <div className="lista-de-cards-scroll space-y-6">
            {carregando ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem 1rem' }}>
                Carregando pontos...
              </p>
            ) : erro ? (
              <p style={{ color: '#ff8a8a', textAlign: 'center', padding: '2rem 1rem' }}>{erro}</p>
            ) : pontosFiltrados.length > 0 ? (
              pontosFiltrados.map((card) => <SpotCard key={card.id} item={card} />)
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 1rem' }}>
                Nenhum ponto corresponde à busca.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}