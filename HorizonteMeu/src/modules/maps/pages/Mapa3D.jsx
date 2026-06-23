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

export function Mapa3D({ pontosTuristicos = [], aoSelecionarPonto }) {
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
        {/* INVERSÃO DE CAMADA PARTE 1: Renderiza primeiro as etiquetas dos Oceanos.
            Como no formato SVG o último elemento declarado fica por cima, se algum oceano colidir com um continente,
            a massa de terra do país cobrirá o texto nativamente, evitando letras poluindo os mapas continentais */}
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

        {/* 2. CAMADA DOS CONTINENTES E PAÍSES (Renderizada sobre a camada de fundo dos oceanos) */}
        {dadosDoMapaJson.features.length > 0 && (
          <Geographies geography={dadosDoMapaJson}>
            {({ geographies, projection }) => {
              // Instancia o gerador de caminhos do D3 com base no modelo de projeção do mapa plano
              const pathGenerator = geoPath().projection(projection);

              return geographies.map((geo) => {
                const { NAME, NAME_LONG, POP_EST, LABEL_RANK } = geo.properties;
                const nomeExibir = NAME || NAME_LONG;
                
                // --- CÁLCULO DE ALINHAMENTO GEOMÉTRICO 2D PERFEITO ---
                // d3-geo calcula o centro exato de gravidade da projeção renderizada na tela (em pixels x, y).
                // Convertemos o ponto de pixels de volta para coordenadas geográficas [lng, lat] para alimentar o marcador.
                let centroPais = null;
                try {
                  const centroidPixels = pathGenerator.centroid(geo);
                  if (centroidPixels && !isNaN(centroidPixels[0]) && !isNaN(centroidPixels[1])) {
                    centroPais = projection.invert(centroidPixels);
                  }
                } catch (e) {
                  centroPais = null;
                }

                // --- TABELA DE TRAVAS CARTOGRÁFICAS EXCLUSIVAS (RESOLUÇÃO DE CONFLITOS DE ILHAS) ---
                // Países fragmentados ou com ilhas distantes (como Alasca nos EUA, Svalbard na Noruega) distorcem a média aritmética.
                // Estas travas forçam as coordenadas geográficas diretamente no coração do território principal (continente)
                if (centroPais) {
                  if (NAME === "United States" || NAME === "United States of America") {
                    centroPais = [-95.7129, 37.0902]; // Centraliza estritamente na parte continental dos EUA (Kansas)
                  } else if (NAME === "France") {
                    centroPais = [2.2137, 46.2276];   // Fixa no centro da França continental
                  } else if (NAME === "Canada") {
                    centroPais = [-97.0000, 56.0000]; // Encaixa no meio das províncias canadenses principais
                  } else if (NAME === "Norway") {
                    centroPais = [8.4689, 60.4720];   // Evita que as ilhas árticas arrastem o nome "Norway" para o oceano
                  }
                }

                // --- SISTEMA DE DENSIDADE POPULACIONAL ADAPTATIVO (ANTI-COLISÃO) ---
                // Controla a visibilidade dos nomes para evitar acúmulo de textos ilegíveis quando o mapa está muito distante
                let deveraOcultar = false;
                if (escala < 250) {
                  // Sem zoom: Oculta territórios pequenos e exibe apenas países gigantes/potências
                  if (POP_EST < 60000000 && LABEL_RANK > 2) deveraOcultar = true;
                } else if (escala >= 250 && escala < 600) {
                  // Zoom intermediário: Libera países de médio porte (fronteiras médias abrem espaço)
                  if (POP_EST < 15000000 && LABEL_RANK > 4) deveraOcultar = true;
                }

                // --- ESCALAMENTO DINÂMICO DE TEXTO ---
                // Inverte o cálculo padrão: o texto diminui de tamanho quando o mapa se afasta para caber nas fronteiras,
                // e expande gradativamente à medida que o usuário aproxima o zoom para dar nitidez profissional
                let tamanhoFonte = 3.5;
                if (escala < 250) tamanhoFonte = 4;
                else if (escala >= 250 && escala < 600) tamanhoFonte = 6;
                else if (escala >= 600 && escala < 1200) tamanhoFonte = 9;
                else tamanhoFonte = 11; 

                return (
                  <g key={geo.rsmKey}>
                    {/* Renderiza a forma geográfica física de cada país */}
                    <Geography
                      geography={geo}
                      style={{
                        default: { fill: "#0b1d33", stroke: "#cca353", strokeWidth: 0.5, outline: "none" },
                        hover: { fill: "#122a47", stroke: "#ffc94a", strokeWidth: 0.8, outline: "none" },
                        pressed: { fill: "#0b1d33", stroke: "#cca353", strokeWidth: 0.5, outline: "none" }
                      }}
                    />
                    {/* Renderiza o texto do rótulo por cima do país, caso passe nos filtros de densidade */}
                    {centroPais && !isNaN(centroPais[0]) && !isNaN(centroPais[1]) && !deveraOcultar && (
                      <Marker coordinates={centroPais}>
                        <text
                          className="country-label"
                          textAnchor="middle"
                          y={tamanhoFonte / 3} // Alinha verticalmente o centro do texto ao marcador geométrico
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

        {/* 3. CAMADA DAS LINHAS (Arcos conectores ligando pontos de interesse pelo globo) */}
        {conexoesArcos.map((arco, i) => (
          <Line
            key={i}
            from={arco.from}
            to={arco.to}
            stroke="#ffc94a"
            strokeWidth={escala < 400 ? 0.7 : 0.4} // Afina as linhas conforme aproxima para manter o visual limpo
            strokeDasharray="4, 4" // Estiliza as linhas como tracejado
          />
        ))}

        {/* 4. CAMADA DOS PINOS DE INTERESSE (Pontos Turísticos e Cidades) */}
        {pontosExibir.map((ponto, i) => {
          // Garante a leitura rígida da ordem de coordenadas [Longitude, Latitude] 
          // independentemente da estrutura do objeto recebido da API, evitando inversão de pinos
          let coords = [0, 0];
          if (ponto.coordinates && ponto.coordinates.length === 2) {
            const c0 = ponto.coordinates[0];
            const c1 = ponto.coordinates[1];
            coords = Math.abs(c0) < Math.abs(c1) ? [c0, c1] : [c1, c0];
          } else {
            coords = [Number(ponto.longitude || ponto.lng), Number(ponto.latitude || ponto.lat)];
          }

          let tamanhoPinoLabel = escala < 400 ? 9 : 12;

          return (
            <Marker 
              key={i} 
              coordinates={coords}
              onClick={() => aoSelecionarPonto && aoSelecionarPonto(ponto)} // Evento de clique para disparar ações externas (como abrir cards de informações)
            >
              {/* Efeito visual de pulso brilhante (glow) sob o marcador */}
              <circle r={escala < 400 ? 5 : 8} fill="rgba(255, 201, 74, 0.2)" stroke="#ffc94a" strokeWidth={0.5} className="svg-pulse" />
              {/* Ponto central indicador do marcador */}
              <circle r={escala < 400 ? 1.5 : 3} fill="#ffc94a" />
              {/* Texto com o nome do Ponto Turístico */}
              <text
                y={escala < 400 ? 10 : 15} // Empurra o texto para baixo para não ficar por cima do pino físico
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