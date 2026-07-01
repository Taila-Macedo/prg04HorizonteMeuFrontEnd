import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { geoPath } from 'd3-geo'; 
import '../styles/Mapa3D.css';

// URL do conjunto de dados GeoJSON contendo as formas geométricas de todos os países do mundo
const geoUrl = "https://vasturiano.github.io/react-globe.gl/example/datasets/ne_110m_admin_0_countries.geojson";

// Coordenadas geográficas fixas ajustadas para posicionar os nomes dos oceanos
// em áreas de vazio absoluto, evitando sobreposição com massas de terra continentais
const oceanos = [
  { nome: "OCEANO ATLÂNTICO", coordinates: [-25, -5] },    // Centralizado no Atlântico Sul aberto
  { nome: "OCEANO PACÍFICO", coordinates: [-120, -15] },  // Pacífico Leste isolado
  { nome: "OCEANO PACÍFICO", coordinates: [165, 25] },    // Pacífico Oeste isolado
  { nome: "OCEANO ÍNDICO", coordinates: [90, -30] },      // Índico centralizado abaixo da linha da Índia
  { nome: "OCEANO GLACIAL ÁRTICO", coordinates: [90, 84] }, // Posicionado no topo extremo norte do mapa
  { nome: "OCEANO GLACIAL ANTÁRTICO", coordinates: [0, -68] } // Posicionado na calota sul, antes da Antártica
];

export function Mapa3D({ pontosTuristicos = [], aoSelecionarPonto, focoCoordenadas }) {
  // Estado que armazena os dados geográficos dos países após o carregamento da API
  const [dadosDoMapaJson, setDadosDoMapaJson] = useState({ features: [] });
  
  // Estados para gerenciar o posicionamento (Pan) e o nível de zoom (Escala) do mapa adaptativo
  const [centro, setCentro] = useState([0, 20]);
  const [escala, setEscala] = useState(140); 
  const [estaArrastando, setEstaArrastando] = useState(false);
  
  // Referências mutáveis para gerenciar elementos do DOM e detecção de movimento do mouse/touchpad
  const mapContainerRef = useRef(null);
  const mousedownPos = useRef({ x: 0, y: 0 });

  // Hook que faz a requisição assíncrona para carregar a malha cartográfica mundial (GeoJSON) ao montar o componente
  useEffect(() => {
    fetch(geoUrl)
      .then(res => res.json())
      .then(setDadosDoMapaJson)
      .catch(err => console.error("Erro ao carregar mapa: ", err));
  }, []);

  // Hook responsável por interceptar o scroll nativo do navegador para controlar o zoom do mapa via mouse wheel
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleWheelNative = (e) => {
      e.preventDefault(); // Impede o zoom padrão da página inteira do navegador
      setEscala((escalaAtual) => {
        const fator = e.deltaY < 0 ? 1.15 : 0.85; // Define a velocidade/suavidade da aproximação
        const novaEscala = escalaAtual * fator;
        // Estabelece limites mínimos e máximos para o zoom para evitar que o usuário perca o mapa de vista
        return Math.max(130, Math.min(novaEscala, 2000));
      });
    };

    container.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelNative);
  }, []);

  // Hook que monitora focoCoordenadas para mover o mapa e aplicar zoom automaticamente no resultado da busca
  useEffect(() => {
    if (
      focoCoordenadas &&
      Array.isArray(focoCoordenadas) &&
      !isNaN(focoCoordenadas[0]) &&
      !isNaN(focoCoordenadas[1])
    ) {
      setCentro(focoCoordenadas);
      setEscala(900); // nível de zoom ao focar em um ponto específico
    }
  }, [focoCoordenadas]);

  // Inicia o estado de arrasto e captura as coordenadas iniciais do clique do mouse
  const handleMouseDown = (e) => {
    setEstaArrastando(true);
    mousedownPos.current = { x: e.clientX, y: e.clientY };
  };

  // Calcula o deslocamento do mouse (Delta) e atualiza o centro do mapa proporcionalmente ao nível de zoom atual
  const handleMouseMove = (e) => {
    if (!estaArrastando) return;
    const deltaX = e.clientX - mousedownPos.current.x;
    const deltaY = e.clientY - mousedownPos.current.y;
    const sensibilidade = 65 / escala; // Ajusta a velocidade do arrasto: quanto maior o zoom, mais lento e preciso fica o movimento

    setCentro(velho => {
      let novaLng = velho[0] - deltaX * sensibilidade;
      let novaLat = velho[1] + deltaY * sensibilidade;
      
      // Restrições de borda (limite de latitude) para impedir que o mapa suma nas extremidades superior e inferior
      if (novaLat > 83) novaLat = 83;
      if (novaLat < -83) novaLat = -83;
      return [novaLng, novaLat];
    });

    mousedownPos.current = { x: e.clientX, y: e.clientY };
  };

  // Finaliza o estado de arrasto quando o botão do mouse é solto ou sai da área do mapa
  const handleMouseUpOrLeave = () => setEstaArrastando(false);

  // Array estático de arcos de conexão (linhas pontilhadas) ligando destinos turísticos globais
  const conexoesArcos = [
    { from: [2.2945, 48.8584], to: [-74.0060, 40.7128] }, // Paris para Nova York
    { from: [2.2945, 48.8584], to: [139.6503, 35.6762] }, // Paris para Tóquio
    { from: [-43.1729, -22.9068], to: [-74.0060, 40.7128] } // Rio de Janeiro para Nova York
  ];

  // Marcador padrão para exibir caso o componente não receba dados externos via props
  const pontosPadrao = [
    { nome: "Torre Eiffel", coordinates: [2.2945, 48.8584] }
  ];

  // Operador ternário para definir se exibe a lista personalizada de pontos ou os marcadores padrão
  const pontosExibir = pontosTuristicos.length ? pontosTuristicos : pontosPadrao;

  return (
    <div 
      ref={mapContainerRef}
      className="globe-canvas-container flat-map-theme"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      style={{ cursor: estaArrastando ? 'grabbing' : 'grab' }} // Muda o cursor visual do mouse durante o arrasto
    >
      <ComposableMap 
        projection="geoMercator" // Utiliza a projeção cilíndrica padrão de Mercator para renderizar o plano mundial
        projectionConfig={{ scale: escala, center: centro }} // Injeta as configurações dinâmicas de escala e posicionamento
        style={{ width: "100%", height: "100%" }}
      >
        {/* INVERSÃO DE CAMADA PARTE 1: Renderiza primeiro as etiquetas dos Oceanos. */}
        {oceanos.map((oc, i) => {
          let tamanhoFonteOceano = escala < 300 ? 8 : (escala < 700 ? 11 : 14);
          return (
            <Marker key={i} coordinates={oc.coordinates}>
              <text 
                className="ocean-label" 
                textAnchor="middle"
                style={{ fontSize: `${tamanhoFonteOceano}px` }}
              >
                {oc.nome}
              </text>
            </Marker>
          );
        })}

        {/* 2. CAMADA DOS CONTINENTES E PAÍSES */}
        {dadosDoMapaJson.features.length > 0 && (
          <Geographies geography={dadosDoMapaJson}>
            {({ geographies, projection }) => {
              const pathGenerator = geoPath().projection(projection);

              return geographies.map((geo) => {
                const { NAME, NAME_LONG, POP_EST, LABEL_RANK } = geo.properties;
                const nomeExibir = NAME || NAME_LONG;
                
                let centroPais = null;
                try {
                  const centroidPixels = pathGenerator.centroid(geo);
                  // SEGURANÇA: Só tenta inverter a coordenada se o pixel calculado for um número válido
                  if (centroidPixels && !isNaN(centroidPixels[0]) && !isNaN(centroidPixels[1]) && isFinite(centroidPixels[0]) && isFinite(centroidPixels[1])) {
                    centroPais = projection.invert(centroidPixels);
                  }
                } catch (e) {
                  centroPais = null;
                }

                // Hardcode de posições específicas caso o cálculo falhe ou mude
                if (NAME === "United States" || NAME === "United States of America") {
                  centroPais = [-95.7129, 37.0902]; 
                } else if (NAME === "France") {
                  centroPais = [2.2137, 46.2276];   
                } else if (NAME === "Canada") {
                  centroPais = [-97.0000, 56.0000]; 
                } else if (NAME === "Norway") {
                  centroPais = [8.4689, 60.4720];   
                }

                let deveraOcultar = false;
                if (escala < 250) {
                  if (POP_EST < 60000000 && LABEL_RANK > 2) deveraOcultar = true;
                } else if (escala >= 250 && escala < 600) {
                  if (POP_EST < 15000000 && LABEL_RANK > 4) deveraOcultar = true;
                }

                let tamanhoFonte = 3.5;
                if (escala < 250) tamanhoFonte = 4;
                else if (escala >= 250 && escala < 600) tamanhoFonte = 6;
                else if (escala >= 600 && escala < 1200) tamanhoFonte = 9;
                else tamanhoFonte = 11; 

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      style={{
                        default: { fill: "#0b1d33", stroke: "#cca353", strokeWidth: 0.5, outline: "none" },
                        hover: { fill: "#122a47", stroke: "#ffc94a", strokeWidth: 0.8, outline: "none" },
                        pressed: { fill: "#0b1d33", stroke: "#cca353", strokeWidth: 0.5, outline: "none" }
                      }}
                    />
                    {/* SEGURANÇA MÁXIMA: Garante que os valores passados para as coordenadas do Marker não são NaN */}
                    {centroPais && 
                    !isNaN(centroPais[0]) && 
                    !isNaN(centroPais[1]) && 
                    isFinite(centroPais[0]) && 
                    isFinite(centroPais[1]) && 
                    !deveraOcultar && (
                      <Marker coordinates={centroPais}>
                        <text
                          className="country-label"
                          textAnchor="middle"
                          y={tamanhoFonte / 3}
                          style={{ fontSize: `${tamanhoFonte}px` }}
                        >
                          {nomeExibir}
                        </text>
                      </Marker>
                    )}
                  </g>
                );
              });
            }}
          </Geographies>
        )}

        {/* 3. CAMADA DAS LINHAS */}
        {conexoesArcos.map((arco, i) => (
          <Line
            key={i}
            from={arco.from}
            to={arco.to}
            stroke="#ffc94a"
            strokeWidth={escala < 400 ? 0.7 : 0.4}
            strokeDasharray="4, 4"
          />
        ))}

        {/* 4. CAMADA DOS PINOS DE INTERESSE */}
        {pontosExibir.map((ponto, i) => {
          let coords = [0, 0];
          if (ponto.coordinates && ponto.coordinates.length === 2) {
            // já vem no formato correto [longitude, latitude]
            coords = [Number(ponto.coordinates[0]), Number(ponto.coordinates[1])];
          } else {
            coords = [Number(ponto.longitude || ponto.lng), Number(ponto.latitude || ponto.lat)];
          }

          let tamanhoPinoLabel = escala < 400 ? 9 : 12;

          return (
            <Marker 
              key={i} 
              coordinates={coords}
              onClick={() => aoSelecionarPonto && aoSelecionarPonto(ponto)}
            >
              <circle r={escala < 400 ? 5 : 8} fill="rgba(255, 201, 74, 0.2)" stroke="#ffc94a" strokeWidth={0.5} className="svg-pulse" />
              <circle r={escala < 400 ? 1.5 : 3} fill="#ffc94a" />
              <text
                y={escala < 400 ? 10 : 15}
                className="glow-label"
                textAnchor="middle"
                style={{ fontSize: `${tamanhoPinoLabel}px` }}
              >
                {ponto.nome}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}